;(function($){
	var $table = $('#lottoTable'),
		$total = $('#lottoTotal');

	var init = function(){
		var item;
		item = '<table>';
		item += '<caption>로또 통계 자료</caption>';
		item += '<thead>',
		item += '<tr>',
		item += '<th scope="col">회차</th>';
		for(var i=1;i<46;i++) {
			item += '<th scope="col">'+ i +'</th>';
		}
		item += '</tr>',
		item += '</thead>',
		item +='<tbody>',
		item +='<tr>',
		item += '<th scope="row">합계</th>';
		for(i=1;i<46;i++) {
			item += '<td data-num="'+ i +'">0</td>';
		}
		item += '</tr>',
		item += '</tbody>',
		item += '</table>';
		if($total.find('table').length == 0) {
			$total.append(item);
		}
		loadLotto();

		$('.btn').on('click', function(){
			sorting($(this).attr('id'));
		});
	};
	var loadLotto = function(){
		$.ajax({
			url: 'dist/js/lottodata.json',
			dataType: 'json',
			success: function(lottodata){
				var i, j, k, lotto = lottodata.lottos,
					value, item;

				/*var str ='';
				 for(var name in data) {
				 	star += '<li>' + data[name] + '</li>';
				 }
				 $(selector).html('<ul>'+ str + '</ul>');*/
				item = '<table>';
				item += '<caption>로또 회차별 당첨번호</caption>';
				item += '<thead>',
				item += '<tr>',
				item += '<th scope="col">회차</th>';
				for(j=1;j<46;j++) {
					item += '<th scope="col">'+ j +'</th>';
				}
				item += '</tr>',
				item += '</thead>',
				item += '<tbody>';
				for(i=0;i<lotto.length;i++){
					item +='<tr>',
					item += '<th scope="row">'+ lotto[i].num +'</th>';
					for(j=1;j<46;j++) {
						item +='<td title="'+ j +'번">';
						for(var key in lotto[i].Data) {  // 6자리 맞는 숫자 찾아서 체크
							value = lotto[i].Data[key];
							if(j === value) {
								item += '<i class="fa fa-check" data-num="'+ j +'"></i>';
							}
						}
						
						item += '</td>';
					}
					item += '</tr>';
				}
				item += '</tbody>',
				item += '</table>';
				$table.append(item);
			},
			complete: function(){
				total();
			}
		});
	};
	var total = function(){
		var i, j, num, cnt, $td = $total.find('td'), arr = [];
		
		// 데이터 만들기
		for(i=1;i<=$table.find('tbody > tr').length;i++){
			for( j=0; j<6; j++) {
				num = parseInt($table.find('tr:eq('+ i +') td > i:eq('+j+') ').attr('data-num'));
				cnt = $total.find('td[data-num='+ num +']').text();
				cnt++;
				$total.find('td[data-num='+ num +']').text(cnt);
			}
		}
	
		// 배열로 가져오기
		for(var k=0; k<$td.length;k++) {
			arr.push(parseInt($td.eq(k).text()));
		}

		// 중복 항목들 제거
		var uniq = arr.slice() // 정렬하기 전에 복사본을 만든다.
			.sort(function(a,b){
				return a - b;
			}).reduce(function(a,b){
				if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] 을 통해 마지막 아이템을 가져온다.
				return a;
			},[]); //a가 시작될 때를 위한 비어있는 배열

		// 큰 수부터 재 정렬
		uniq = uniq.sort(function(a, b){return b-a}).slice(0, -1);
		// console.log(uniq);
		
		var max = Math.max.apply(null, uniq); // 가장 많이 나온 숫자
		for(var z=0;z<6;z++){
			$td.each(function(){
				var tmp = parseInt($(this).text());
				if(tmp == uniq[z]) { // 6개의 숫자가 제일 많이 나온 색상 구분
					$(this).addClass('key_num');
				} 
				if(tmp == max) { // 가장 나온 많이 나온 숫자 분류
					$(this).addClass('maxium');
				}
			});
		}
	};
	// 정렬 버튼
	var sorting = function(elem){
		if( elem == 'sort' ) {

		} else {

		}
	};
	var selecBox = function() {

	};
	$(document).ready(function(){
		init();
	});
})(jQuery);

// 6개의 숫자를 출력
// 추후에 5번의 각기 다른 6개 숫자를  출력

