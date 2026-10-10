package com.asaanurdu.keyboard.keyboard

import android.inputmethodservice.InputMethodService
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputConnection
import com.asaanurdu.keyboard.transliteration.RomanUrduTransliterationEngine

/**
 * Production-ready Android InputMethodService for Asaan Urdu Keyboard.
 * Handles InputConnection text commits, cursor handling, composing buffer,
 * Roman Urdu transliteration toggle, and language switching.
 */
class UrduInputMethodService : InputMethodService() {

    private val transliterationEngine = RomanUrduTransliterationEngine()
    private var composingWord = StringBuilder()
    private var isEasyUrduEnabled = true
    private var currentMode = KeyboardMode.URDU
    private var vibrator: Vibrator? = null

    override fun onCreate() {
        super.onCreate()
        vibrator = getSystemService(VIBRATOR_SERVICE) as? Vibrator
    }

    override fun onStartInput(attribute: EditorInfo?, restarting: Boolean) {
        super.onStartInput(attribute, restarting)
        composingWord.clear()
    }

    override fun onFinishInput() {
        super.onFinishInput()
        commitComposingText()
    }

    fun onKeyInput(code: Int, keyText: String?) {
        performHaptic()
        val ic: InputConnection = currentInputConnection ?: return

        when (code) {
            -5 -> handleDelete(ic)
            32 -> handleSpace(ic)
            -4 -> handleEnter(ic)
            -101 -> toggleLanguage()
            -102 -> toggleEasyUrdu()
            else -> {
                keyText?.let { handleCharacter(ic, it) }
            }
        }
    }

    private fun handleCharacter(ic: InputConnection, char: String) {
        if (isEasyUrduEnabled && currentMode == KeyboardMode.ENGLISH) {
            composingWord.append(char)
            ic.setComposingText(composingWord.toString(), 1)
        } else {
            commitComposingText()
            ic.commitText(char, 1)
        }
    }

    private fun handleDelete(ic: InputConnection) {
        if (composingWord.isNotEmpty()) {
            composingWord.deleteCharAt(composingWord.length - 1)
            if (composingWord.isEmpty()) {
                ic.commitText("", 1)
            } else {
                ic.setComposingText(composingWord.toString(), 1)
            }
        } else {
            ic.deleteSurroundingText(1, 0)
        }
    }

    private fun handleSpace(ic: InputConnection) {
        if (composingWord.isNotEmpty()) {
            val converted = transliterationEngine.transliterateWord(composingWord.toString())
            ic.commitText("$converted ", 1)
            composingWord.clear()
        } else {
            ic.commitText(" ", 1)
        }
    }

    private fun handleEnter(ic: InputConnection) {
        commitComposingText()
        ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER))
        ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER))
    }

    private fun commitComposingText() {
        val ic = currentInputConnection ?: return
        if (composingWord.isNotEmpty()) {
            val converted = if (isEasyUrduEnabled) {
                transliterationEngine.transliterateWord(composingWord.toString())
            } else {
                composingWord.toString()
            }
            ic.commitText(converted, 1)
            composingWord.clear()
        }
    }

    private fun toggleLanguage() {
        commitComposingText()
        currentMode = if (currentMode == KeyboardMode.URDU) KeyboardMode.ENGLISH else KeyboardMode.URDU
    }

    private fun toggleEasyUrdu() {
        isEasyUrduEnabled = !isEasyUrduEnabled
    }

    private fun performHaptic() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createOneShot(12, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(12)
            }
        } catch (_: Exception) {}
    }

    enum class KeyboardMode { URDU, ENGLISH, SYMBOLS }
}
