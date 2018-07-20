
CD 系列相繼誕生了一系列作品，包括最早的 RS485 對等傳輸的協議 —— CDBUS、其上層協議 —— CDNET，模組免焊接裝配方式 —— CDBITE.

今天要介紹的是一個進程間通訊的庫 —— CDIPC, 其中還包含一個解析命令行參數的庫 —— CDARGS.

本來想找一個二進制版本的 JSON 序列化庫，譬如 BSON 這些，但都嫌實時性不夠、相關的解析庫龐大且複雜，準備自己再寫一個 CDSON,
不過暫時沒時間還是算了（畢竟 C 和 D 不太可能會有 SON）。


## 爲何 CDIPC

很多年前，入行機器人領域的前夕，就接觸到 ROS 這款機器人操作系統，它本質是一個 IPC 的通訊庫，然後很多第三方的程序使用其通訊，
因此構建成爲了一個系統。

ROS 的通訊有兩個核心：topic 和 service, 其中 topic 又是重中之重，它是 M-to-N 多對多的通訊方式，不同接收者收到相同的數據。
而 service 是 M-to-1 的 RPC, 類似遠程調用函數然後返回結果。

使用 IPC 的好處是便於模塊化編程，將一個大的系統劃分多個小模塊，有助於降低任務難度，且可以最大程度的復用已有模塊，而無需修改代碼。
同時，各模塊可以用不同的編程語言和技術來實現，譬如講究實時性的地方用 C/C++ 來寫，而界面部分可以用 Python、Javascript、HTML 等實現，
這樣開發效率遠遠比統一語言和庫要高的多。不同模塊是獨立的程序，可以隔離錯誤，否則類似 C/C++ 語言中用錯指針導致 bug 很難排查（除非是當時就報錯），
而且，不重要的模組出錯退出（譬如 UI 展示），不會影響到系統運作，降低事故風險。

然而，ROS 的通訊不是實時的，且十分臃腫，並不是很適合用做機器人控制。後來找了很久，找到一個實時的面向機器人的實時 IPC 庫，
叫做 ACH, 主頁：http://www.golems.org/projects/ach.html

然而 ACH 同樣不好用，首先，它不支持 service 功能，其次，它不是很穩定，譬如某個模塊程序意外退出，會導致 mutex 死鎖 (其實是 glibc 的 bug: https://sourceware.org/bugzilla/show_bug.cgi?id=21422 ).
雖然 ACH 使用的是共享內存交換數據，但是發佈數據和收取數據都要經過 memcpy 內存拷貝，很低效。

而且，無論是 ROS 還是 ACH, 它們的 topic 都不支持我想要的一款功能：可以分別爲不同接收者配置一個參數 —— 是否允許丟棄數據。
ROS 和 ACH 的 topic 所支持的模式都是發佈者可以不受限制的發佈數據，如果接收方處理不過來的話，最老的數據便會丟失。

然而有些場合我們希望當接收者處理不過來的時候，發送者予以等待。
這種情況，如果使用 ROS, 我們需要單獨再建一個 topic 或 service 讓發佈者查詢接收者是否過忙，會很麻煩。

ROS 還有一個不方便的地方是，只有 topic 支持錄製保存數據用於調試，而 service 卻不支持。

爲了解決以上種種問題，所以，我創建了 CDIPC 這個開源項目。


## CDIPC 特點

 - 進程間交換數據通過內存直接共享，且無需拷貝。
 - 因爲實時任務不允許動態申請內存，所以 CDIPC 是創建時提前指定好最大支持的發佈和接收者數量、數據塊大小和數量等信息。
 - 支持 topic 和 service 功能，且都支持錄製調試。
 - 可以選擇是否允許丟棄數據，不同的接收者可以有不同設置，譬如爲核心接收者設置不允許丟棄數據，而爲錄製程序對應的接收者設置允許丟棄數據，因爲不能因爲調試這個輔助功能影響到核心功能的安全。
 - 和 ACH 一樣，不規定通訊數據格式，如有需要，用戶可以自行選擇第三方序列化的庫。
 - 因爲使用的是 PI-futex 做 mutex 和 cond, 效率非常高，且內核驅動可以通過 CDIPC 與用戶進程直接交換數據。（之前爲實時內核 PREEMT-RT 寫驅動的時候，一直在想用什麼接口好，/dev 接口、unix socket、sysfs 接口貌似都很低效，中間環節太多，實時性難以保障）
 - 已經通過 swig 提供了 Python 語言的接口，其它語言想訪問 CDIPC 就很簡單了，同樣的 swig 配置，改下編譯參數就可以。
 - 可以通過配套的小工具，把 CDIPC 導出爲 WebSocket 等接口，方便瀏覽器端程序直接訪問 CDIPC.
 - 就連 windows 都支持 futex, 所以將來可能可以移植到不同系統（然而支持實時的桌面系統只有 Linux）。

CDIPC 核心結構如下，topic 和 service 共用同一套，灰色部分是 service 僅有。

<img src="cdipc-data-structure.svg" style="max-width:100%">

具體描述還請移步到項目頁面：https://github.com/dukelec/cdipc

配套有一個命令行工具，可以方便的用來測試 CDIPC, 和 dump 指定 topic 和 service 數據狀態。


## CDARGS

最後提一下這個命令行參數解析庫，因爲使用 CDIPC 後，我準備再寫一個圖形化的工具（之前基於 ROS 寫過一款），方便配置模組、連線模組、監控模組運行狀態（譬如視覺算法模組可以實時顯示當前處理的畫面），連線信息通過命令行參數傳遞給不同的模塊程序，會涉及到動態參數，譬如我們希望某個模塊可以支持動態數量的輸入信號。

用法很簡單，例如：

```
cd_args_t ca;
cd_args_parse(&ca, argc, argv);

// if --id not found, use default value "0"
// --id 3, --id=3 are the same
int id = atol(cd_arg_get_def(&ca, "--id", "0"));

// -h is short version for --help, return not NULL if found of any
// return NULL if arg not found, return empty string if arg has no value
if (cd_arg_get2(&ca, "--help", "-h")) {
    printf("%s", usage_dump);
    exit(0);
}

// we could call cd_arg_get_left in a loop to report all left args
const char *left = cd_arg_get_left(&ca);
if (left) {
    df_error("unknown arg: %s\n", left);
    printf("%s", usage_dump);
    exit(-1);
}
```

CDARGS 同時也有提供 Python 的版本，全部包含在 CDIPC 庫中。

造這個輪子之前，我同樣是苦苦找尋了很久，別人寫的都超複雜，且不滿足我的動態需求。。。

