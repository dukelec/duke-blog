這兩天又重寫了博客系統，整體架構沒變，還是 RESTful 爲主，輔以 /archive 快照改善兼容性問題。
主要改動：
 - 文件數據目錄結構調整，方便本地靜態瀏覽，且可以在 Github 等平臺瀏覽（萬一哪天出了什麼意外，服務器沒有人繳費，至少文章內容依然能長存）；
 - Metadata 等數據文件格式由 ini 改爲 json, 編輯、解析更方便，對複雜字串支持也好一些；
 - 由於要公開於 Github 等平臺，所以用戶評論所提交的 email 地址等敏感信息加密存儲；
 - 後臺不再使用 bash 腳本，改用 Python CGI 實現，優雅很多；
 - 前臺不再使用 Angular2 等框架，裸寫 Javascript 代碼，簡潔很多，維護方便，頁面加載也快很多。

驗證碼等功能暫時沒有加，因爲發現使用 RESTful 的博客有一個很大的好處：從來沒有遇到廣告留言。

Git 庫中代碼和此博客內容分離，如果你也想嘗試，克隆 master 分支即可：
https://github.com/dukelec/duke-blog.git

<hr>
Backup:

<small>
呃，已經寫了好幾次 blog 後臺了，上一次是寫於三年前（2013.1），
當時是基於 GAE(Google App Engine)、Bottle(Python 網站框架)，主題借用 Octopress,
後來，由於 GAE 一再更新 API、GAE 被牆等因素，還有 blog 本身架構爲佔用最少 GAE 資源，
犧牲了很多用戶體驗，最終決定棄用，不再更新，可通過 gae 自帶域名 http://duke-blog.appspot.com 訪問。
（更加古老的 163 博客：http://dukedz.blog.163.com）

新版本特色：
 - 基於 RESTful 架構，前後台完全分離，通過 API 接口交換數據；
 - 後臺使用 bash 腳本，數據以分立文件及目錄結構組織，未使用傳統數據庫；
 - 前台使用 Angular2 實作 SPA(Single Page Applacation);
 - 框架可支持多格式可選，暫時支持 markdown、html 及 plain 文本；
 - 支持任意 filter 組合，不侷限數量與類型（前臺暫未實現）；
 - 回覆支持蓋樓（前臺暫未實現）；
 - 回覆嚴格度可配置（前臺暫未實現）：無驗證碼、圖形驗證碼、郵件發送驗證碼（變相註冊，用戶心理上更易接受）。

保留舊版本特色：
 - 文章支持權限限制，email 驗證過用戶按組可閱讀部分隱藏文章（前臺暫未實現）。

已知缺點：
 - 所有頁面都是由 javascript 加載，除 Google 搜尋外，其它很多搜尋引擎不支持；（現通過建立 /archive 快照來解決）
</small>
