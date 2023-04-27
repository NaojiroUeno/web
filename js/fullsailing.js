$(function () {
  var MENU_NAMES = ["company", "service", "recruit", "contact"];
  var NENU_CLASSES = MENU_NAMES.map(function (name) {
    return "." + name;
  });

  // フィード時間(ms)
  var FADE_DURATION = 250;

  // 連続クリック回避策
  var cancelFlag = 0;

  // ページ遷移
  function showContent(name, duration) {
    $(".index, .content").fadeOut(duration);
    setTimeout(function () {
      $(NENU_CLASSES.join(",")).hide();
      $(".content").scrollTop(); // スクロール状態をリセット
      $(".content").addClass("menu-content");
      var names = [".header-logo", ".footer-list", ".menu-content", "." + name];
      $(names.join(",")).fadeIn(duration).show();
    }, duration);
    console.log("a")
  }
  // トップに戻る
  function showTop(duration) {
    $(".header-logo, .footer-list, .content").fadeOut(duration);
    setTimeout(function () {
      $(NENU_CLASSES.concat([".menu-content"]).join(",")).hide();
      $(".content").removeClass("menu-content");
      $(".content, .index").fadeIn(duration);
    }, duration);
    console.log("b")
  }

  // 企業理念のアニメーション
  function fadeInOutPhilosophy () {
    $(".philosophy-h").fadeIn(2000, function(){
      $(".philosophy-p").fadeIn(2000, function(){
        $(".corporate-philosophy").fadeOut(2000, function(){
          $(".logo-wrap").css("display", "block");
          $(".logo-wrap").animate({opacity: 1}, 2000);
        });
      });
    });
    console.log("c")
  }

  function navigate(name, fromBrowser = false, initial = false) {
    // 重複したページへの遷移をカット
    var currentName = window.location.pathname.substring(1);
    if (
      !fromBrowser &&
      !initial &&
      ((name === "index" && currentName === "") || name === currentName)
    )
      return;

    // 連打対策
    if (cancelFlag === 1) return;
    cancelFlag = 1;

    // ブラウザバック/次へ の場合以外はstateを手動更新
    // if (!fromBrowser) {
    //   var path = name === "index" ? "/" : "/Users/Nao-U/web/" + name;
    //   window.history.pushState(null, null, "/index");

    // }

    var duration = initial ? 0 : FADE_DURATION;

    if (name === "index") {
      showTop(duration);
      $(".link-underline").removeClass("active");
      fadeInOutPhilosophy();
    } else {
      showContent(name, duration);
      $(".link-underline").removeClass("active");
      $(".menu-" + name + " .link-underline").addClass("active");
    }

    setTimeout(function () {
      cancelFlag = 0;
    }, duration * 2);
    console.log("d")
  }

  // 問い合わせプレビュー
  window.submitCheck = function () {
    if ($(".contact-confirm-dialog").is(":visible")) {
      return true;
    } else {
      $('[data-confirm-name="name"]').text($('[data-name="name"]').val());
      $('[data-confirm-name="email"]').text($('[data-name="email"]').val());
      $('[data-confirm-name="tel"]').text($('[data-name="tel"]').val());
      $('[data-confirm-name="company"]').text($('[data-name="company"]').val());
      $('[data-confirm-name="inquiry"]').html(
        $('[data-name="inquiry"]').val().replace(/\r?\n/g, "<br>")
      );
      $(".contact-confirm-dialog").fadeIn(FADE_DURATION);
      return false;
    }
    console.log("e")
  };
//
  // メニュー遷移クリックをセット
  MENU_NAMES.forEach(function (name) {
    $(".menu-" + name).on("click", function () {
      navigate(name);
    });
    console.log("f")
  });

  // return-top
  $(".close, .header-logo, .close-area").on("click", function () {
    navigate("index");
    console.log("g")
  });

  // ブラウザバック・進むのハンドル
  window.addEventListener("popstate", function (event) {
    navigate(event.state ? event.state.name : "index", true);
    console.log("h")
  });
//
  // 初期パスから表示状態をセット
  var name = window.location.pathname.substring(1);
  if (name) {
    if (MENU_NAMES.includes(name)) {
      // 通常のページ
      navigate(name, false, true);
    } else if (name === "contact_complete") {
      // 問合せ完了
      alert(
        "お問合せ内容を送信しました。\n後ほど、担当者よりご連絡をさせていただきます。"
      );
      //history.replaceState({ name: "contact" }, null, "/contact");
      window.location.pathname = "/contact";
    } /*else {
      // 無効なURL
      window.location = "/";
    }*/
  } else {
    navigate("index", false, true);
  }

  $(".contact-confirm-dialog").on("click", function (e) {
    if (e.target === this) {
      $(".contact-confirm-dialog").fadeOut(FADE_DURATION);
    }
  });
  $(".contact-confirm-dialog").hide();
  console.log("i")
});


console.log("test")

$(function () {
  var webStorage = function () {
    if (sessionStorage.getItem('access')) {
      /*
        2回目以降アクセス時の処理
      */
      $(".loading").addClass('is-active');
    } else {
      /*
        初回アクセス時の処理
      */
      sessionStorage.setItem('access', 'true'); // sessionStorageにデータを保存
      $(".loading-animation").addClass('is-active'); // loadingアニメーションを表示
      setTimeout(function () {
        // ローディングを数秒後に非表示にする
        $(".loading").addClass('is-active');
        $(".loading-animation").removeClass('is-active');
      }, 3000); // ローディングを表示する時間
    }
  }
  webStorage();
});

var unit = 100,
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList; // 各キャンバスの色情報

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {
    info.seconds = 0;
    info.t = 0;
    canvasList = [];
    colorList = [];
    // canvas1個めの色指定
    canvasList.push(document.getElementById("waveCanvas"));
    colorList.push(['#fff', '#fff', '#fff', '#fff', '#fff']);//重ねる波線の色設定
    
  
    // 各キャンバスの初期化
    for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = 200;//波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
    // 共通の更新処理呼び出し
    update();
}

function update() {
    for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        // 各キャンバスの描画
        draw(canvas, colorList[canvasIndex]);
    }
    // 共通の描画情報の更新
    info.seconds = info.seconds + .014;
    info.t = info.seconds*Math.PI;
    // 自身の再起呼び出し
    setTimeout(update, 35);
}

/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
    // 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    //波線を描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 0.8, 3, 0);
  drawWave(canvas, color[1], 0.5, 4, 0);
  drawWave(canvas, color[2], 0.3, 1.6, 0);
  drawWave(canvas, color[3], 0.2, 3, 100);
  drawWave(canvas, color[4], 0.5, 1.6, 250);
}

/**
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/
function drawWave(canvas, color, alpha, zoom, delay) {
  var context = canvas.contextCache;
    context.strokeStyle = color;//線の色
  context.lineWidth = 1;//線の幅
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context.stroke(); //線
}

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();