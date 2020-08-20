項目源碼： https://github.com/dukelec/cde

試用地址：
 - https://e.d-l.io
 - https://dukelec.github.io/cde
 - https://dukelec.gitee.io/cde （適合中國內地使用）

## 使用方法

譬如我分享一個鏈接：

https://e.d-l.io/#MnjnvW3FFpB/yuOrkjGVlARp6BEoz6O1ah0FccFc5vQ=

再用其它途徑提供密碼：`88888888` （8 個 8，密碼可以是任意字符，包含中文，長度不限。）

你只需要在首次使用時被提示輸入密碼，日後只要點開鏈接就可以看到內容，還能直接分享加密後的回覆。

此工具還支持圖片、視頻和其它所有文件的打包加密（數據量大時，加密內容打包爲文件另行分享）。  
還可以把文件上傳到一個文件服務器（要開啓 CORS 或使用第三方 CORS proxy 代理），然後只需要分享一個連接即可：`https://CDE_TOOL_URL/#+https://ENCRYPTED_FILE_URL`.
（`#+` 後面的 `https://` 可以省略。）

## 大文件免費空間

国内的 码云 gitee 也支持 pages，且直接可以同步 github 代码。  
我在 gitee 上也同步了一份 CDE: https://gitee.com/dukelec/cde  
然后，又建立了一个存文件的库： https://gitee.com/dukelec/nrf （故意取一个 mcu 的名字，怕被说违规。）  
（兩個庫都要開啓 pages 功能。）

最后，我把加密的文件放到 nrf 里面，然后就可以直接分享带文件的连接给别人，可以带图片、视频，国内速度很快。  
因为域名相同，没有 CORS 问题。（如果大家也想这么玩，需要自己同步一份 CDE 的库，才能确保域名相同。）

譬如，我分享昨天在 1024 上面看到的文章给我妈，密码 8 个 8：  
https://dukelec.gitee.io/cde/#+/nrf/nrf5x.bin  
（因爲域名相同，文件地址可以省略重複的域名。）

## 技巧

#### 圖文批量複製

上面例子分享这么多图片的技巧是，直接复制带图片的网页内容，贴到 CDE 编辑界面，然后点保存资源到本地，然后再导出加密文件即可，图片、视频、文件等资源就已经存到加密后的文件中了。  
（瀏覽器需要安裝類似 `CORS Unblock` 的插件。）

#### 超鏈接自動生成

加密少量文字，直接分享帶加密數據連接的情況，如果內容包含網址，網址自身的超鏈接信息會比較佔空間，譬如原始數據 `d-l.io` 帶連接後爲 `<a href="https://d-l.io">d-l.io</a>` 長了很多，
現在，只需要寫原始數據 `d-l.io`，分享出去會自動加上超連接，且不增加加密後的數據長度，預覽也可以查看效果。

#### 隱寫

如果分享連接不想讓第三方知道，可以使用下面這種隱寫的方式，不知道的人以為你在分享淘寶連接，其實是一樓的加密數據，只要複製鏈接，在 CDE 工具菜單中選擇輸入文字，貼上就可以看到內容。  
（隨便找一個連接，刪短一點，尾部增加 # 和其後的加密數據，或文件地址。）  
https://item.taobao.com/item.htm?id=552376962169&abtest=34&sid=5bc5c4aa08#MnjnvW3FFpB/yuOrkjGVlARp6BEoz6O1ah0FccFc5vQ=

帶加密文件的方式：  
https://item.taobao.com/item.htm?id=552376962169&abtest=34&sid=5bc5c4aa08#+dukelec.gitee.io/nrf/nrf5x.bin

如果覺得文件太明顯，可以把原始連接 `dukelec.gitee.io/cde/#+/nrf/nrf5x.bin` 當文本加密，生成帶加密數據的連接，再隱寫即可。

## 最後

免安裝的好處不僅是減少首次使用的麻煩，更能支持所有平臺：Android, iOS, MacOS, Windows, Linux,
而且此網頁應用是基於 PWA 技術，可以離線使用，也可以很方便的添加到手機桌面。
（古老的 IE 應該不支持，支持所有主流瀏覽器。）

加密算法爲 AES-256-CBC, 代碼也很簡潔，使用 Vanilla JS, 歡迎貢獻代碼。

本專案是爲了學習 HTML5 相關知識，請勿做其它用途。
