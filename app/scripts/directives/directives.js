angular.module('directivesApp', [])
    .directive("pdfPlay", function () {
        return {
            replace: true,
            transclude: true,
            link: function (scope, ele) {
                var kid = scope.knowledgeid;//id
                var clientRect = ele[0].getBoundingClientRect();
                scope.$watch('knowledgeFileUrl', function (newValue) {
                    if (typeof newValue != "undefined" && newValue != "") {
                        //获取屏幕宽度
                        var winHeight = 0;
                        var winWidth = 0;
                        var arr = new Array();//用于放入已经加载出的界面
                        function findDimensions() //函数：获取尺寸
                        {   //获取窗口宽度
                            if (window.innerWidth)
                                winWidth = window.innerWidth;
                            else if ((document.body) && (document.body.clientWidth))
                                winWidth = document.body.clientWidth;   //获取窗口高度
                            if (window.innerHeight)
                                winHeight = window.innerHeight;
                            else if ((document.body) && (document.body.clientHeight))
                                winHeight = document.body.clientHeight;   //通过深入Document内部对body进行检测，获取窗口大小
                            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                                winHeight = document.documentElement.clientHeight;
                                winWidth = document.documentElement.clientWidth;
                            }   //结果输出至两个文本框
                            //document.form1.availHeight.value= winHeight;
                            // document.form1.availWidth.value= winWidth;
                        }

                        findDimensions();   //调用函数，获取数值
                        function SetCookie(sName, sValue) {
                            date = new Date();
                            s = date.getDate();
                            date.setDate(s + 7);            //expire time is one month late!, and can't be current date!
                            document.cookie = sName + "=" + escape(sValue) + "; expires=" + date.toGMTString();
                        }

                        function GetCookie(sName) {
                            // cookies are separated by semicolons
                            var aCookie = document.cookie.split("; ");
                            for (var i = 0; i < aCookie.length; i++) {
                                // a name/value pair (a crumb) is separated by an equal sign
                                var aCrumb = aCookie[i].split("=");
                                if (sName == aCrumb[0]) {
                                    return unescape(aCrumb[1]);
                                }
                            }
                            return null;
                        }

                        var pageheight = 0;
                        var url = scope.knowledgeFileUrl;
                        var pdfWithFormsPath = url;
                        var formFields = {};
                        var ifscale = true;

                        function renderPage(div, pdf, pageNumber, callback) {
                            if (arr.indexOf(pageNumber) == -1) {
                                arr.push(pageNumber);
                                pdf.getPage(pageNumber).then(function (page) {
                                    var scale = 1;
                                    //缩放
                                    if (ifscale) {
                                        var viewportmax = page.getViewport(scale);
                                        if (winWidth > viewportmax.width) {
                                            scale = winWidth / viewportmax.width;
                                            ifscale = false;
                                        }
                                    }
                                    var viewport = page.getViewport(scale);
                                    var pageDisplayWidth = viewport.width;
                                    var pageDisplayHeight = viewport.height;
                                    if (pageNumber == 1) {
                                        for (var i = 1; i <= pdf.numPages; i++) {
                                            var pageDivHolder = document.createElement('div');
                                            //pageDivHolder.className = 'pdfpage';
                                            pageDivHolder.id = 'pageContainer' + i;
                                            pageDivHolder.title = 'page' + i;
                                            pageDivHolder.style.margin = '5px auto';
                                            pageDivHolder.style.backgroundColor = 'white';
                                            pageDivHolder.style.width = pageDisplayWidth + 'px';
                                            pageDivHolder.style.height = pageDisplayHeight + 'px';
                                            pageDivHolder.style.zoom = winWidth / pageDisplayWidth;
                                            div.appendChild(pageDivHolder);
                                            if (i == pdf.numPages) {
                                                scope.$apply(function () {
                                                    scope.Loading = false;
                                                });
                                                pageheight = (pageDisplayHeight + 5) * winWidth / pageDisplayWidth;
                                                document.body.scrollTop = GetCookie(kid);
                                            }
                                        }
                                    }
                                    var pageC = 'pageContainer' + pageNumber;
                                    // Prepare canvas using PDF page dimensions
                                    var canvas = document.createElement('canvas');
                                    var context = canvas.getContext('2d');
                                    canvas.width = pageDisplayWidth;
                                    canvas.height = pageDisplayHeight;
                                    document.getElementById(pageC).appendChild(canvas);
                                    // Render PDF page into canvas context
                                    var renderContext = {
                                        canvasContext: context,
                                        viewport: viewport
                                    };
                                    page.render(renderContext).promise.then(callback);
                                });
                            }
                        }

                        var numPagesAll;//总页数
                        var pdfLoaderTask = PDFJS.getDocument(pdfWithFormsPath);
                        pdfLoaderTask.then(function getPdfForm(pdf) {
                            // Rendering all pages starting from first
                            var viewer = document.getElementById('viewer');
                            var pageNumber = 1;
                            renderPage(viewer, pdf, pageNumber++, function pageRenderingComplete() {
                                numPagesAll = pdf.numPages;
                                if (pageNumber > pdf.numPages) {
                                    return; // All pages rendered
                                }
                                // Continue rendering of the next page
                                ifscale = true;
                                renderPage(viewer, pdf, pageNumber++, pageRenderingComplete);
                            });
                        });

                        function fnUnload() {
                            SetCookie(kid, document.body.scrollTop);
                        }

                        var pagelin = 0;//临时
                        scope.pageindex = 0;//传出
                        //用于滚动时单个加载
                        function renderPageOne(pageNumber) {
                            pdfLoaderTask.then(function getPdfForm(pdf) {
                                if (pageNumber > pdf.numPages || pageNumber <= 0) {
                                    return;
                                }
                                arr.push(pageNumber);
                                pdf.getPage(pageNumber).then(function (page) {
                                    var scale = 1;
                                    //缩放
                                    var viewportmax = page.getViewport(scale);
                                    if (winWidth > viewportmax.width) {
                                        scale = winWidth / viewportmax.width;
                                        ifscale = false;
                                    }
                                    var viewport = page.getViewport(scale);
                                    var pageDisplayWidth = viewport.width;
                                    var pageDisplayHeight = viewport.height;
                                    var pageC = 'pageContainer' + pageNumber;
                                    var canvas = document.createElement('canvas');
                                    var context = canvas.getContext('2d');
                                    canvas.width = pageDisplayWidth;
                                    canvas.height = pageDisplayHeight;
                                    document.getElementById(pageC).appendChild(canvas);
                                    // Render PDF page into canvas context
                                    var renderContext = {
                                        canvasContext: context,
                                        viewport: viewport
                                    };
                                    page.render(renderContext).promise;
                                });
                            });
                        }

                        window.onscroll = function () {
                            pagelin = Math.ceil((document.body.scrollTop + winHeight) / (pageheight));//页数
                            //alert(pagelin);
                            if (pagelin > numPagesAll) {
                                pagelin = numPagesAll;
                            }
                            if (pagelin <= 0) {
                                pagelin = 1;
                            }
                            var pagepin = Math.ceil(winHeight / pageheight);//一屏中显示的页数
                            for (var i = 0; i <= pagepin; i++) {
                                if (arr.indexOf(pagelin - i) == -1) {
                                    renderPageOne(pagelin - i);
                                }
                            }
                            if (scope.pageindex < pagelin) {
                                scope.pageindex = pagelin;
                            }
                        }
                        window.onunload = fnUnload;
                    }
                });
            }
        }
    })
    .directive("dialog", function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: "views/common/dialog.html",
            replace: true,
            link: function(scope, element){
                element.find('button').bind('click', function(){
                    element.hide();
                });
            }
        }
    })
    .directive("hasDeleteItem", function () {
        return function (scope, ele) {
            var start, end, flag = false,
                startY = 0, endY = 0,
                deleteItem = $(ele[0]).find(".item-delete"),
                tItem = deleteItem.prev().get(0);

            touch.config.swipeMinDistance = 10;

            touch.on(tItem, "swipeleft", function (e) {
                var x = -e.distanceX,
                    y = Math.abs(e.distanceY);

                if (y <= 10) {
                    tItem.style.transform = "translateX(-60px)";
                    tItem.style.webkitTransform = "translateX(-60px)";
                    flag = true;
                }

            });

            $(tItem).on("touchstart", function (evt) {

                if (flag) {
                    evt.preventDefault();
                    tItem.style.transform = "translateX(0)";
                    tItem.style.webkitTransform = "translateX(0)";
                    flag = false;
                }


            });

        };
    })
    .directive('focus', function($timeout) {
        return {
            scope : {
                trigger : '@focus'
            },
            link : function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === "true") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });
