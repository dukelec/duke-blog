項目源碼：<a href="https://github.com/dukelec/cde">https://github.com/dukelec/cde</a>

試用地址
 - <a href="https://e.d-l.io">https://e.d-l.io</a>
 - <a href="https://dukelec.github.io/cde">https://dukelec.github.io/cde</a>


譬如我分享一個鏈接：

<a href="https://e.d-l.io/#ZSdJZX7vOwtQQk1MMwnpyPUa7zSsjRoyKORbpCEt4Ts=">https://e.d-l.io/#ZSdJZX7vOwtQQk1MMwnpyPUa7zSsjRoyKORbpCEt4Ts=</a>

再用其它途徑提供密碼：`今晚打老虎`

你只需要在首次使用時被提示輸入密碼，日後只要點開鏈接就可以看到內容，還能直接分享加密後的回覆。

此工具還支持圖片、視頻和其它所有文件的打包加密（數據量大時，加密內容打包爲文件另行分享）。  
還可以把文件上傳到你的服務器（要開啓 CORS），然後只需要分享一個連接即可：`https://CDE_TOOL_URL/#+https://ENCRYPTED_FILE_URL`.

免安裝的好處不僅是減少首次使用的麻煩，更能支持所有平臺：Android, iOS, MacOS, Windows, Linux,
而且此網頁應用是基於 PWA 技術，可以離線使用，也可以很方便的添加到手機桌面。
（古老的 IE 應該不支持，支持所有主流瀏覽器。）

加密算法爲 AES-256-CBC, 代碼也很簡潔，使用 Vanilla JS, 歡迎貢獻代碼。

本專案是爲了學習 HTML5 相關知識，請勿做其它用途。
