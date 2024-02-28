var $body = $('body'),
    $tt_article_useless_p_margin = $('.tt_article_useless_p_margin'),
    $ttBodySearch = $('#tt-body-search');


function login() {
    if ($('.txt_id').length) {
        if ($('.txt_id_type2').text() == $('meta[name="author"]').attr('content')) {
            return 1
        }
        if ($('.txt_id_type2').text() != $('meta[name="author"]').attr('content')) {
            return 2
        }
    } else {
        return 3
    }
}


function switching(clickElement, popElement, changeTxt, prevTxt) {
    var selfPressedClass = 'active',
        elementOpenedClass = 'pop';
    if (clickElement.hasClass(selfPressedClass)) {
        clickElement.removeClass(selfPressedClass).text(prevTxt);
        popElement.removeClass(elementOpenedClass)
    } else {
        clickElement.addClass(selfPressedClass).text(changeTxt);
        popElement.addClass(elementOpenedClass);
    }
}


function addNaverSubscription() {
    window.open('https://nid.naver.com/nidlogin.login?mode=form&svctype=64&url=http://section.blog.naver.com/connect/PopConnectBuddyAddForm.nhn?blogId=' + id_naver, '', 'width=444, height=509, resizable=no, scrollbars=no, status=no');
}


function articleContentPositionFixed() {
    var $fixedElement = $('.articleheader-figure-semi #tt-body-page .module-article, .articleheader-figure-full #tt-body-page .module-article'),
        $fixedElement2 = $('.articleheader-figure-semi.sidebar-static:not(".sidebar-bottom") #tt-body-page aside, .articleheader-figure-full.sidebar-static:not(".sidebar-bottom") #tt-body-page aside');

    $fixedElement.css('margin-top', $('.article-header-figure').height());
    if (window.matchMedia('(min-width: 769px)').matches) {
        $fixedElement2.css('margin-top', $('.article-header-figure').height());
    } else {
        $fixedElement2.css('margin-top', 'initial');
    }
}


function textBindTopLikeButton(t) {

    var $topLikeButton = $('.article-action-post-button .postbtn_like button.uoc-icon'),
        $bottomLikeButton = $('.container_postbtn:not(".article-action-post-button") .postbtn_like button.uoc-icon');

    t.parents('.module-article').find($bottomLikeButton).bind('DOMSubtreeModified', function () {

        setTimeout(function () {
            if ($bottomLikeButton.find('.uoc-icon').attr('class') === 'uoc-icon empathy_up_without_ani like_on') {
                t.parents('.module-article').find($topLikeButton).find('.uoc-icon').addClass($bottomLikeButton.find('.uoc-icon').attr('class'));
            } else {
                t.parents('.module-article').find($topLikeButton).find('.uoc-icon').removeClass('uoc-icon empathy_up_without_ani like_on').addClass('uoc-icon');
            }
        }, 0);

        t.parents('.module-article').find($topLikeButton).find('.uoc-count').text(t.parents('.module-article').find($bottomLikeButton).find('.uoc-count').text());
    });

}


function textareaResize(t) {
    var resize_min_height = '150px';
    t.style.height = resize_min_height;
    t.style.height = t.scrollHeight - 2 + "px";
}


function getRelatedArticleSummary() {
    $('.article-related-article .list-item').each(function (e) {
        var t = $(this),
            a = t.find('p span');
        $.ajax({
            url: t.attr('href'),
            dataType: 'html',
            success: function (e) {

                if (e.match('<meta property="og:description" content="(.*)"') != null) {
                    var l = e.match('<meta property="og:description" content="(.*?)"')[0];
                    l = l.substring(41, l.length - 1).replaceAll('...', '…').replaceAll('..', '…'),
                        a.html(l.replaceAll('&amp;', '&'));
                } else {
                    var user_manager = !$('.btn_menu_toolbar.btn_subscription').length;
                    if (user_manager) {
                        a.text('비공개되었거나 보호되어 있는 글입니다.');
                    } else {
                        a.text('보호되어 있는 글입니다.');
                    }
                }

            }
        }); // ajax
    }); // each
}




$(window).resize(function () {

    articleContentPositionFixed();

});




window.onload = function () {

    var $TISTORY_MENU_SUBSCRIPTION_BTN = $('.menu_toolbar button.btn_subscription'),
        $BUTTON_SUBSCRIPTION = $('.button-subscription'),
        $BUTTON_LOGIN = $('.button-login'),

        user_manager = login() === 1,
        user_member = login() === 2,
        user_visitor = login() === 3,

        option_topmenu_search_none = !$('.topmenu-search-none').length,

        os_filter = "win16|win32|win64|mac|macintel",

        $topLikeButton = $('.article-action-post-button .postbtn_like button.uoc-icon'),
        $bottomLikeButton = $('.container_postbtn:not(".article-action-post-button") .postbtn_like button.uoc-icon');


    if (user_member) {
        $BUTTON_SUBSCRIPTION.addClass('view');
        $BUTTON_SUBSCRIPTION.text($TISTORY_MENU_SUBSCRIPTION_BTN.find('.txt_state').text());
        $BUTTON_SUBSCRIPTION.on('click', function () {
            $TISTORY_MENU_SUBSCRIPTION_BTN.trigger('click');
        });

        $BUTTON_LOGIN.addClass('view');
        $BUTTON_LOGIN.text('로그아웃');
        $BUTTON_LOGIN.on('click', function () {
            location.href = 'https://www.tistory.com/auth/logout';
        });
    }


    if (user_visitor) {
        $('.container_postbtn:not(.article-action-post-button) .btn_menu_toolbar.btn_subscription').remove();
        $('.container_postbtn:not(.article-action-post-button) .postbtn_like').after('<button class="btn_menu_toolbar btn_subscription" type="button"><em class="txt_state">구독하기</em></button>');
        $('.container_postbtn .btn_menu_toolbar.btn_subscription').on('click', function () {
            if (id_naver != undefined) {
                addNaverSubscription();
            } else {
                $TISTORY_MENU_SUBSCRIPTION_BTN.trigger('click');
            }
        });

        $BUTTON_SUBSCRIPTION.addClass('view');
        $BUTTON_SUBSCRIPTION.on('click', function () {
            if (id_naver != undefined) {
                addNaverSubscription();
            } else {
                $TISTORY_MENU_SUBSCRIPTION_BTN.trigger('click');
            }
        });

        $BUTTON_LOGIN.addClass('view');
    }


    followingStatusBind();
    function followingStatusBind() {
        if ($('.menu_toolbar .btn_menu_toolbar.btn_subscription.following').length) {
            $BUTTON_SUBSCRIPTION.addClass('following');
        }

        $('.menu_toolbar .btn_menu_toolbar.btn_subscription').bind('DOMSubtreeModified', function () {
            if ($('.menu_toolbar .btn_menu_toolbar.btn_subscription').attr('class').match('following')) {
                $BUTTON_SUBSCRIPTION.addClass('following');
            } else {
                $BUTTON_SUBSCRIPTION.removeClass('following');
            }
        });
    }


    if (option_topmenu_search_none) {
        $ttBodySearch.find('.nav-blog-menu').addClass('hide');
    }


    $ttBodySearch.find('.nav-input-search').addClass('pop');
    $ttBodySearch.find('.button-input-search-open').addClass('active').text('닫기');
    $ttBodySearch.find('.input-search').val($('.nav-input-search').val());


    if (navigator.platform) {
        if (os_filter.indexOf(navigator.platform.toLowerCase()) < 0) {
            $('.article-header-buttons-tonggae').remove();
        }
    }


    fixedLikeButtonTop();
    function fixedLikeButtonTop() {
        var $topLikeButton = $('.article-action-post-button .postbtn_like button.uoc-icon'),
            $bottomLikeButton = $('.container_postbtn:not(".article-action-post-button") .postbtn_like button.uoc-icon');

        $('.container_postbtn').each(function () {
            $(this).parents('.module-article').find($topLikeButton).find('.uoc-count').text($(this).parents('.module-article').find($bottomLikeButton).find('.uoc-count').text());

            if ($bottomLikeButton.find('.uoc-icon').attr('class') === 'uoc-icon empathy_up_without_ani like_on') {
                $(this).parents('.module-article').find($topLikeButton).find('.uoc-icon').addClass($bottomLikeButton.find('.uoc-icon').attr('class'));
            } else {
                $(this).parents('.module-article').find($topLikeButton).find('.uoc-icon').removeClass('uoc-icon empathy_up_without_ani like_on').addClass('uoc-icon');
            }
        });
    }


    $('[class*="system-ques"] .imageslideblock .image-container').append('<button class="button-slider-big" type="button">뷰어</button>');


    $('.button-slider-big').on('click', function () {
        $(this).parent().find('.image-wrap.selected').trigger('click');
    });


    addListStyleToRelatedArticle();
    function addListStyleToRelatedArticle() {
        var t = $('.article-related-article').find('header a');
        $.ajax({
            url: t.attr('href'),
            dataType: 'html',
            success: function (e) {
                var g = $(e).find('section .module-list').attr('class');
                $('.article-related-article').addClass(g).addClass('view');
            }
        }); // ajax
    }


    changeUrlTistory();
    function changeUrlTistory() {
        var currentUrl = location.protocol + '//' + location.hostname,
            tistoryUrl = $('.menu_toolbar .btn_menu_toolbar.btn_subscription').attr('data-url');

        if (currentUrl != tistoryUrl && tistoryUrl != undefined) {
            $('#view').append('<div class="button-tistory-href-wrap"><button class="button-tistory-href" type="button">티스토리 주소로 보기</button><button class="button-tistory-href-alert" type="button">?</button></div>');
        }

        $('.button-tistory-href').on('click', function () {
            if (currentUrl != tistoryUrl) {
                location.href = tistoryUrl + location.pathname;
            }
        });

        $('.button-tistory-href-alert').on('click', function () {
            if (confirm('블로그를 티스토리 주소로 보면 로그인 후 제한 없는 댓글, 구독 등의 티스토리 로그인 기반 기능을 사용할 수 있습니다.\n티스토리 주소로 전환할까요?')) {
                if (currentUrl != tistoryUrl) {
                    location.href = tistoryUrl + location.pathname;
                }
            }
        });

    }


} //window.onload




$(function () {

    var $TISTORY_MENU_SUBSCRIPTION_BTN = $('.menu_toolbar button.btn_subscription'),
        $BUTTON_SUBSCRIPTION = $('.button-subscription'),
        $BUTTON_LOGIN = $('.button-login'),

        user_manager = login() === 1,
        user_member = login() === 2,
        user_visitor = login() === 3,

        wrong_page = $('.absent_post').length,

        url_is_find_comment = window.location.href.match('#comment'),

        os_filter = "win16|win32|win64|mac|macintel",

        $topLikeButton = $('.article-action-post-button .postbtn_like button.uoc-icon'),
        $bottomLikeButton = $('.container_postbtn:not(".article-action-post-button") .postbtn_like button.uoc-icon'),

        d = new Date(),
        month = d.getMonth() + 1,
        day = d.getDate(),

        current = month + '' + day,
        $NAV_LOGO_FLAG = $('.nav-logo-flag');


    if (anniversary_korea_celebrate) {
        if (current == 31 || current == 717 || current == 815 || current == 103 || current == 109) {
            $NAV_LOGO_FLAG.css('display', 'flex').attr('target', '_blank');
        }
        if (current == 31) {
            $NAV_LOGO_FLAG.attr('href', 'https://www.google.co.kr/search?q=3.1절');
        }
        if (current == 717) {
            $NAV_LOGO_FLAG.attr('href', 'https://www.google.co.kr/search?q=제헌절');
        }
        if (current == 815) {
            $NAV_LOGO_FLAG.attr('href', 'https://www.google.co.kr/search?q=광복절');
        }
        if (current == 103) {
            $NAV_LOGO_FLAG.attr('href', 'https://www.google.co.kr/search?q=개천절');
        }
        if (current == 109) {
            $NAV_LOGO_FLAG.attr('href', 'https://www.google.co.kr/search?q=한글날');
        }
    }


    $TISTORY_MENU_SUBSCRIPTION_BTN.find('.txt_state').bind('DOMSubtreeModified', function () {
        $BUTTON_SUBSCRIPTION.text($TISTORY_MENU_SUBSCRIPTION_BTN.find('.txt_state').text());
    });


    if (user_manager) {
        $BUTTON_SUBSCRIPTION.removeClass('button-subscription').addClass('button-write').addClass('view').text('글쓰기');
        $BUTTON_LOGIN.removeClass('button-login').addClass('button-manage').addClass('view').text('관리');
    }


    $BUTTON_LOGIN.on('click', function () {
        var currentUrl = location.protocol + '//' + location.hostname,
            tistoryUrl = $('.menu_toolbar .btn_menu_toolbar.btn_subscription').attr('data-url');
        if (currentUrl != tistoryUrl && tistoryUrl != undefined) {
            if (confirm('로그인을 위해 티스토리 주소로 변경합니다. 로그인되지 않으면 로그인 버튼을 한번 더 눌러주세요.')) {
                if (currentUrl != tistoryUrl) {
                    location.href = tistoryUrl + location.pathname;
                }
            }
        } else {
            location.href = 'https://www.tistory.com/auth/login';
        }
    });


    $('.button-manage').on('click', function () {
        location.href = '/manage';
    });


    $('.button-write').on('click', function () {
        location.href = '/manage/newpost/?type=post&returnURL=%2Fcategory';
    });


    $('.topmenu-search-none.topmenu-button2-none.topmenu-button1-none .nav-blog-menu ul:empty').parents('.second-nav').find('.nav-button-hiding-menu-oepn').remove();


    /* 글 꾸며주는 스타일이 포함된 세번째 링크 제거 /content/content.css 형태 */
    $('link:nth-child(3)').remove();
    $('hr:not(.article-title-hr)').wrap('<div class="hr-wrap"></div>');
    $('p:empty, figcaption:empty').remove();
    $('figure[data-ke-type="video"] iframe').wrap('<div class="video-wrap"></div>');


    if (wrong_page) {
        alert('잘못된 주소이거나, 비공개 또는 삭제된 글입니다');
        location.href = '/';
    }


    if ($tt_article_useless_p_margin.length) {
        $tt_article_useless_p_margin.contents().unwrap();
    } else {
        $tt_article_useless_p_margin.parents('.module-article').addClass('use_p_margin');
    }


    articleContentPositionFixed();


    $('.article-action-post-button .postbtn_like button.uoc-icon').on('click', function () {
        $(this).parents('.module-article').find($bottomLikeButton).trigger('click');
        textBindTopLikeButton($(this));
    });


    $('.article-action-post-button .wrap_btn_share button').on('click', function () {
        $(this).parents('.module-article').find('.container_postbtn:not(".article-action-post-button") .wrap_btn_share button').trigger('click');
        $('#tistorySnsLayer').css({
            top: $(this).parents('.module-article').find('.article-action-post-button').offset().top + 34 + 'px'
        });
    });


    $('.article-action-post-button .wrap_btn_share + .wrap_btn button').on('click', function () {
        $(this).parents('.module-article').find('.container_postbtn:not(".article-action-post-button") .wrap_btn_share + .wrap_btn button').trigger('click');
    });


    $('.article-action-post-button .wrap_btn_etc button').on('click', function () {
        $(this).parents('.module-article').find('.container_postbtn:not(".article-action-post-button") .wrap_btn_etc button').trigger('click');
        $('#tistoryEtcLayer').css({
            top: $(this).parents('.module-article').find('.article-action-post-button').offset().top + 34 + 'px'
        });
    });


    getRelatedArticleSummary();


    $bottomLikeButton.on('click', function () {
        textBindTopLikeButton($(this));
    });


    if (url_is_find_comment) {
        $('.article-comment-open').trigger('click');
    }


    $('.module-comment').each(function () {
        if ($(this).find('.comment-header-txt-count:empty').length || $(this).find('.comment-header-txt-count span').text() === '0' && $(this).find('form').is(':empty')) {
            $(this).css('display', 'none');
        }
    });


    $('.list-txt-comment').each(function () {
        var m = $(this).html().replace(/\(/g, '').replace(/\)/g, '');
        if (!$(this).text().length) {
            $(this).html('댓글 0개');
        } else {
            $(this).html('댓글 ' + m + '개');
        }
    });


}); //$(function()




$('.button-input-search-open').on('click', function () {
    switching($(this), $('.nav-input-search'), '닫기', '검색');
    if ($('.nav-input-search.pop').length) {
        $('.nav-input-search').focus();
        if (!$('.topmenu-search-none').length) {
            $('.nav-blog-menu').addClass('hide');
        }
    } else {
        $('.nav-blog-menu').removeClass('hide');
    }
});


$('.nav-button-hiding-menu-oepn').on('click', function () {
    switching($(this), $('nav'), '닫기', '메뉴');
    if ($('nav.pop').length) {
        $body.addClass('nav-pop');
    } else {
        $body.removeClass('nav-pop');
    }
});


$('.article-header-buttons-tonggae').on('click', function () {
    $(this).parents('.module-article').find('.container_postbtn:not(".article-action-post-button") .wrap_btn_share + .wrap_btn button').trigger('click');
});


$('.article-header-buttons-adminopen').on('click', function () {
    switching($(this), $(this).parents('.module-article').find('.article-header-admin-buttons'));
});


$body.on('click', '.article-comment-open', function () {
    switching($(this), $(this).parents('.module-article').find('.module-comment > div'), '접기', '보기');
});

$body.on('click', '.comment-secret-checked-button', function () {
    $(this).prev().trigger('click');
});

$body.on('click', '.comment-shingo', function () {
    $(this).parent().find('.comment-txt-date a').trigger('click');
});


$(function () {

    if (navigator.appVersion.indexOf('Mac') != -1) {
    } else {
        $('html').addClass('other-os-font');
    }

});