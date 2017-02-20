var $ = jQuery.noConflict();

/*
나눔로또 API
// http://blog.kaisyu.com/2010/07/web-api.html
// http://stackoverflow.com/questions/10089447/jquery-ajax-request-inside-ajax-request
*/
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

(function($){
'use strict';
	if (!$.concat)  {
		$.extend({ 
			concat: function() { 
				return arguments.length ? Array.prototype.concat.apply([], arguments) : [];
			 }
		});
	}

	var $window = $(window),
		$document = $(document),
		$body = $('body'),
		$wrap = $('#wrap'),
		$table = $('#lottoTable'),
		$winNum = $('#lottoWinNum'),
		$dim = $('.dimmed'),
		nlotto = nlotto || {};

	// 초기화
	nlotto = {
		init:function() {
			nlotto.settingTable(), nlotto.PopupLayer(), nlotto.keyUp(), nlotto.devNote(), nlotto.chkLotto();
			nlotto.loadData();
		},
		settingTable:function(){
			var item;

			item = '<table class="responsive lotto_tables">';
			item += '<caption>로또 통계 자료</caption>';
			item += '<thead>',
			item += '<tr>',
			item += '<th scope="col">회차</th>';
			item += '<th scope="col">당첨번호</th>';
			item += '<th scope="col">보너스 번호</th>';
			item += '<th scope="col">날짜</th>';
			item += '</tr>',
			item += '</thead>',
			item +='<tbody id="LuckyNumber">';
			item += '</tbody>';
			item += '</table>';
			if($table.find('table').length == 0) {
				$table.append(item);
			}
		},
		TabsMenu:function(){
			var $menu = $('.ui_tabs_menu'),
				$contWrap = $('.ui_tabs_contents_wrap'),
				_content ='.ui_tab_content',
				curr = 'current';

			if(!$menu.length ) { return }
			$(_content).css('display', 'none');
			$contWrap.each(function(){
				$(this).find('div' + _content +':first').css('display', 'block');
			});
			$menu.on('click','a', function(){
				if(!$(this).hasClass(curr)){
					$(this).addClass(curr).closest('li').siblings('li').find('.' + curr).removeClass(curr);
					$($(this).attr('href')).css('display', 'block').siblings('div'+_content).css('display', 'none');
				}
				this.blur();
				return false;
			});
		},
		// 레이어팝업 닫기
		PopupLayer:function(){
			$document.mousedown(function(e) {
				$('.popup-layer').each(function() {
					var _this = $(this);
					if( _this.css('display') == 'block' ) {
						var objPos = _this.offset();
						objPos.right = (objPos.left + $(this).width());
						objPos.bottom = (objPos.top + $(this).height());
						if( e.pageX < objPos.left || e.pageX > objPos.right || e.pageY < objPos.top || e.pageY > objPos.bottom ) {
							_this.css('display', 'none');
							if($dim.length){
								$dim.removeAttr('style');
							}
						}
					}
				});
			});
		},
		devNote:function(){
			$('.layerpop').on('click', function(e){
				e.preventDefault();
				var obj = $(this).attr('href');
				$(obj).css('display', 'block');
				var _h = $(obj).height(),
					_w = $(obj).width();

				$(obj).css({
					marginTop: -(_h/2) + 'px',
					marginLeft: -(_w/2) + 'px'
				});
				$dim.css('display', 'block');
			});
		},
		keyUp:function(){
			$document.keyup(function(e){
				// ESC키
				if(e.keyCode == 27) {
					$('.popup-layer').each(function() {
						var _this = $(this);
						if( _this.css('display') == 'block' ) {
							_this.css('display', 'none');
							if($dim.length){
								$dim.removeAttr('style');
							}
						}
					});
				}
			});
		},
		loadData:function(){
			var url = "https://spreadsheets.google.com/feeds/list/1IOYuPUjZH0ZPlMPy6eCPElR2o_FLraXLEgoEdlel_G4/od6/public/values?alt=json";
			$.getJSON(url, function(data){
				var entry = data.feed.entry;
				$(entry).each(function(i){
					// console.log( $(this).eq(i) );
					console.log( this );
					var item = '';
					// item += '<p>' + this.gsx$_cvlqs.$t + '</p>';
					// item += '<h2>' + this.gsx$_cu76f.$t + '</h2>';
					$table.append(item);
				});
			});
		},
		chkLotto:function(){
			var item = '';
		},
		createTable:function(){

		}
	};
	var twolength = function(n) {
		return (n < 10 ? '0' : '') + n
	};

	var jRes = jRespond([
		{
			label: 'smallest',
			enter: 0,
			exit: 479
		},{
			label: 'handheld',
			enter: 480,
			exit: 767
		},{
				label: 'tablet',
				enter: 768,
			exit: 991
		},{
			label: 'laptop',
			enter: 992,
			exit: 1199
		},{
			label: 'desktop',
			enter: 1200,
			exit: 10000
		}
	]);
	jRes.addFunc([
		{
			breakpoint: 'desktop',
			enter: function() { $body.addClass('device-lg'); },
			exit: function() { $body.removeClass('device-lg'); }
		},{
			breakpoint: 'laptop',
			enter: function() { $body.addClass('device-md'); },
			exit: function() { $body.removeClass('device-md'); }
		},{
			breakpoint: 'tablet',
			enter: function() { $body.addClass('device-sm'); },
			exit: function() { $body.removeClass('device-sm'); }
		},{
			breakpoint: 'handheld',
			enter: function() { $body.addClass('device-xs'); },
			exit: function() { $body.removeClass('device-xs'); }
		},{
			breakpoint: 'smallest',
			enter: function() { $body.addClass('device-xxs'); },
			exit: function() { $body.removeClass('device-xxs'); }
		}
	]);

	$(document).ready(function(){
		nlotto.init();
	});
})(jQuery);