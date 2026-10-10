package com.asaanurdu.keyboard.transliteration

class RomanUrduTransliterationEngine {

    private val dictionary: Map<String, List<String>> = mapOf(
        "assalam" to listOf("السلام"),
        "alaikum" to listOf("علیکم"),
        "kaise" to listOf("کیسے"),
        "aap" to listOf("آپ"),
        "ap" to listOf("آپ"),
        "hai" to listOf("ہے", "ہیں", "ہو"),
        "theek" to listOf("ٹھیک"),
        "shukriya" to listOf("شکریہ"),
        "bohot" to listOf("بہت"),
        "acha" to listOf("اچھا"),
        "mujhe" to listOf("مجھے"),
        "urdu" to listOf("اردو"),
        "likhni" to listOf("لکھنی"),
        "pakistan" to listOf("پاکستان"),
        "hamara" to listOf("ہمارا"),
        "pyara" to listOf("پیارا"),
        "mulk" to listOf("ملک"),
        "allah" to listOf("اللہ"),
        "khuda" to listOf("خدا")
    )

    private val digraphs = mapOf(
        "kh" to "خ", "gh" to "غ", "ch" to "چ", "jh" to "جھ",
        "th" to "تھ", "ph" to "پھ", "bh" to "بھ", "dh" to "دھ",
        "sh" to "ش", "aa" to "آ", "ee" to "ی", "oo" to "و"
    )

    private val letters = mapOf(
        'a' to "ا", 'b' to "ب", 'p' to "پ", 't' to "ت", 'T' to "ٹ",
        'j' to "ج", 'c' to "چ", 'h' to "ہ", 'd' to "د", 'D' to "ڈ",
        'r' to "ر", 'R' to "ڑ", 'z' to "ز", 's' to "س", 'q' to "ق",
        'f' to "ف", 'k' to "ک", 'g' to "گ", 'l' to "ل", 'm' to "م",
        'n' to "ن", 'v' to "و", 'w' to "و", 'u' to "و", 'o' to "و",
        'i' to "ی", 'e' to "ے", 'y' to "ی"
    )

    fun transliterateWord(word: String): String {
        val clean = word.trim().lowercase()
        return dictionary[clean]?.firstOrNull() ?: transliteratePhonetic(word)
    }

    fun getCandidates(word: String): List<String> {
        val clean = word.trim().lowercase()
        val list = mutableListOf<String>()
        dictionary[clean]?.let { list.addAll(it) }
        val phonetic = transliteratePhonetic(word)
        if (!list.contains(phonetic)) list.add(phonetic)
        return list
    }

    fun transliteratePhonetic(word: String): String {
        if (word.isEmpty()) return ""
        val lower = word.lowercase()
        val result = StringBuilder()
        var i = 0

        if (lower.startsWith("aa")) {
            result.append("آ")
            i = 2
        } else if (lower.startsWith("a")) {
            result.append("ا")
            i = 1
        }

        while (i < word.length) {
            if (i + 1 < word.length) {
                val pair = word.substring(i, i + 2).lowercase()
                if (digraphs.containsKey(pair)) {
                    result.append(digraphs[pair])
                    i += 2
                    continue
                }
            }
            val char = word[i]
            letters[char]?.let { result.append(it) } ?: letters[char.lowercaseChar()]?.let { result.append(it) } ?: result.append(char)
            i++
        }
        return result.toString()
    }
}
