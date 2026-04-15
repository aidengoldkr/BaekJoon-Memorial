"use client";

import { useState } from "react";
import styles from "./mypage.module.css";

const PRIMARY_LANGUAGES = ["C++", "Python", "Java", "C", "Kotlin", "JavaScript", "TypeScript", "Go", "Rust"];

const ALL_EXTRA_LANGUAGES = [
  "C++17", "C++98", "C++11", "C++14", "C++20", "C++98 (Clang)", "C++11 (Clang)", "C++14 (Clang)", "C++17 (Clang)", "C++20 (Clang)", "C++23", "C++26",
  "Java 8", "Java 8 (OpenJDK)", "Java 11", "Java 15",
  "Python 3", "PyPy3", "Python 2", "PyPy2",
  "C11", "C99", "C90", "C2x", "C11 (Clang)", "C99 (Clang)", "C90 (Clang)", "C2x (Clang)",
  "Rust 2015", "Rust 2018", "Rust 2021",
  "Ruby", "Kotlin (JVM)", "Swift", "Text", "C#", "node.js", "Go (gccgo)", "D", "D (LDC)", "PHP", "Pascal", "Scala", "Lua", "Perl",
  "F#", "Visual Basic", "Objective-C", "Objective-C++", "Golfscript", "Assembly (32bit)", "Assembly (64bit)", "Bash", "Fortran", "Scheme",
  "Ada", "awk", "OCaml", "Brainf**k", "Whitespace", "Tcl", "Rhino", "Cobol", "Pike", "sed", "INTERCAL", "bc", "Algol 68", "Befunge", "FreeBASIC", "Haxe",
  "LOLCODE", "아희", "SystemVerilog", "엄준식", "Kotlin (Native)", "Cython", "F# (Mono)", "Raku", "R", "Haskell", "C# 6.0 (Mono)",
  "Ceylon", "Octave", "C# 3.0 (Mono)", "VB.NET 2.0 (Mono)", "VB.NET 4.0 (Mono)", "CoffeeScript", "Groovy", "Common Lisp", "Erlang", "Clojure",
  "Smalltalk", "SpiderMonkey", "Falcon", "Factor", "Dart", "Boo", "Oz", "Alice", "Prolog", "Nemerle", "Cobra", "Nim", "Forth", "Julia", "Io", "Gosu",
  "Coq", "Minecraft", "APECODE", "Crystal"
];

// 중복 제거
const EXTRA_LANGUAGES = ALL_EXTRA_LANGUAGES.filter(lang => !PRIMARY_LANGUAGES.includes(lang));

interface Props {
  defaultSelected: string[];
}

export function LanguageSelector({ defaultSelected }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className={styles.languageGrid}>
        {PRIMARY_LANGUAGES.map((lang) => (
          <label key={lang} className={styles.langOption}>
            <input
              type="checkbox"
              name="top_languages"
              value={lang}
              defaultChecked={defaultSelected.includes(lang)}
              className={styles.checkbox}
            />
            {lang}
          </label>
        ))}
      </div>
      
      {!isExpanded && (
        <button 
          type="button" 
          onClick={() => setIsExpanded(true)}
          className={styles.expandBtn}
        >
          채점 지원 언어 모두 보기 ▼
        </button>
      )}

      {isExpanded && (
        <div className={styles.languageGridExpanded}>
          {EXTRA_LANGUAGES.map((lang) => (
            <label key={lang} className={styles.langOption}>
              <input
                type="checkbox"
                name="top_languages"
                value={lang}
                defaultChecked={defaultSelected.includes(lang)}
                className={styles.checkbox}
              />
              {lang}
            </label>
          ))}
        </div>
      )}
      
      {isExpanded && (
        <button 
          type="button" 
          onClick={() => setIsExpanded(false)}
          className={styles.expandBtn}
        >
          접기 ▲
        </button>
      )}
    </>
  );
}
