var filter_content;
var filter_load;
var filter_load_text;
var slider_list = [];
var timeout_link;

// показ и скрытие выпадающих чекбоксов в фильтре
$(document).on('click', '.psevdoselect > span', function(){
    $('.psevdoselect').removeClass('psevdoselect-open');
    $(this).parents('.psevdoselect').addClass('psevdoselect-open');
    return false;
});
$(document).on('click', '.psevdoselect .trigger-arrow', function(){
    $('.psevdoselect').removeClass('psevdoselect-open');
    $(this).parents('.psevdoselect').addClass('psevdoselect-open');
    return false;
});
$(document).on('click', 'body', function(){
    $('.psevdoselect').removeClass('psevdoselect-open');
});
$(document).on('click', '.psevdoselect-hidden', function(event){
	event.stopPropagation();
});

// выбрать все
$(document).on('click', '.js--check-all', function(){
    if($(this).find('input').prop('checked') == false){
        $(this).parents('.psevdoselect-hidden').find('input').each(function(){
            $(this).prop('checked', 'checked')
        });
    }
    else{
        $(this).parents('.psevdoselect-hidden').find('input').each(function(){
            $(this).prop('checked', false)
        });
    }
    send_filter();
    return false;
});

// выбрать некоторые
$(document).on('click', '.psevdoselect-hidden label:not(.js--check-all)', function(){
    $(this).parents('.psevdoselect-hidden').find('.js--check-all  input').prop('checked', false);
    send_filter();
});

// слайдер
setTimeout(function(){
    if($( ".js--slider-two" ).length){
        $(".js--slider-two" ).each(function(){
        var parent = $(this).parents('.form-col');
        var min_range = Number($(this).attr('data-min_range'));
        var max_range = Number($(this).attr('data-max_range'));
        var min_current = Number($(this).attr('data-min-current'));
        var max_current = Number($(this).attr('data-max-current'));
        var step = Number($(this).attr('data-step'));
        var arr = [];

        arr.push(min_current);
        arr.push(max_current);
        var slider = $(this).slider({
            range: true,
            min: min_range,
            max: max_range,
            values: arr,
            step: step,
            slide: function (event, ui) {
                var min_current = Number(ui.values[0]);
                var max_current = Number(ui.values[1]);
                min_current = min_current.toString();
                min_current = number_format(min_current);
                max_current = max_current.toString();
                max_current = number_format(max_current);
                parent.find('.range_min').prop('value', min_current);
                parent.find('.range_max').prop('value', max_current);
                send_filter();
            }
        });
        slider_list.push(slider);
        min_current = min_current.toString();
        min_current = number_format(min_current);
        max_current = max_current.toString();
        max_current = number_format(max_current);
        parent.find('.range_min').prop('value', min_current);
        parent.find('.range_max').prop('value', max_current);

        $(document).on('input','.slider-double-value', function(){
            var pos = $(this).parents('.form-col').find('.filter--slide-line').attr('data-index');
            if($(this).data("lastval")!= $(this).val()) {
                if($(this).val() == ''){
                    $(this).prop('value',0)
                }
                else{
                    var value = $(this).prop('value');
                    value = value.replace(/\s+/g, '');
                    value = Number(value);
                    value = value.toString();
                    value = number_format(value);
                    if(value == "NaN"){
                        $(this).prop('value',0)
                    }else{
                        $(this).prop('value',value);
                    }
                };
                $(this).data("lastval", $(this).val());

                if (timeout_link) {
                    clearTimeout(timeout_link)
                }

                var min_value_input = $(this).parents('.form-col').find('.range_min').prop('value');
                var max_value_input = $(this).parents('.form-col').find('.range_max').prop('value');
                var arr_new = [];
                min_value_input = min_value_input.replace(/\s+/g, '');
                min_value_input = Number(min_value_input);
                max_value_input = max_value_input.replace(/\s+/g, '');
                max_value_input = Number(max_value_input);
                if(min_value_input < max_value_input) {
                    arr_new.push(min_value_input);
                    arr_new.push(max_value_input);
                    timeout_link = setTimeout(function () {
                        slider_list[pos].slider("values", arr_new);
                        send_filter();
                    }, 250);
                }
            };
        });
    });
};

    // стилизация селектов
if($('.filter').length){
    $('.filter-form select.inp-styled').each(function(){
      $(this).styler({
        onSelectClosed: function() {
            send_filter();
        }
      });
    })
    }
}, 10);

// формат цифр
function number_format( str ){
    return str.replace(/(\s)+/g, '').replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ');
};

// сброс фильтра
$(document).on('click', '.js--filter-reset', function(){
    $('.filter').find('input.range_min').prop('value', $('.filter--slide-line').attr('data-min-current'));
    $('.filter').find('input.range_max').prop('value', $('.filter--slide-line').attr('data-max-current'));
    $('.filter').find('.slider-double-value').trigger('input');
    $('.filter').find('.jq-selectbox').each(function () {
        $(this).find('li.filter-default').trigger('click');
    });
    $('.filter').find('.psevdoselect').each(function () {
        $(this).find('input').prop('checked', false);
    });
    send_filter();
    $('.load-container').empty().append(filter_content);
        if(filter_load == '1'){
        $('.filter-result__more').removeClass('hidden-block').find('a').text(filter_load_text);
    }
    else{
        $('.filter-result__more').addClass('hidden-block');
    }
    return false;
});

$(document).on('click', '.filter-tabs span', function(){
    send_filter()
});

// отправка данных фильтра и получение конечного значения и разметки
function send_filter(){
    var form = $('.filter-form');
    var method = form.attr('method');
    var url = form.attr('action');

    $.ajax({
        url: url,
        method: method,
        data: form.serialize(),
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.js--show-result i').text("(" + parse_data.counter + ")");
            filter_content = parse_data.content;
            filter_load = parse_data.has_load;
            filter_load_text = parse_data.load_link;
        }
    });
}

$(document).on('click', '.js--show-result', function(){
    if(filter_content == undefined){
        return false
    }
    else{
        if($('.js--show-result i').text() == '(0)'){
            $('.load-container').empty().append("<p class='filter--load-empty'>К сожалению, по вашему запросу ничего не найдено. Попробуйте изменить условия поиска</p>")
            $('.filter-result__more').addClass('hidden-block');
        }
        else{
            $('.load-container').empty().append(filter_content);
            if(filter_load == '1'){
                $('.filter-result__more').removeClass('hidden-block').find('a').text(filter_load_text);
            }
            else{
                $('.filter-result__more').addClass('hidden-block');
            }
        }
    }
    return false
});

// подгрузка журналов
$(document).on('click', '.js--show-more', function(){
    var block = $(this).parents(".load-container").find("ul");
    var method = $(this).attr('data-metod');
    var url = $(this).attr('data-url');
    var type = $(this).attr('data-type-magazin');
    var counter = block.find('li').length;
    var link = $(this).parent();

    $.ajax({
        url: url,
        method: method,
        data: {counter: counter, type: type},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            block.append(parse_data.content);
            if(parse_data.has_load == '1'){
                $(link).find('a').text(parse_data.load_link);
            }
            else{
                $(link).addClass('hidden-block');
            }
        }
    });

    return false;
});

// подгрузка таблицы
$(document).on('click','.privat__more .js--show-table', function(){
    var block = $(this).parents(".load-container").find("table");
    var method = $(this).attr('data-metod');
    var url = $(this).attr('data-url');
    var counter = block.find('tr').length;
    var link = $(this).parent();

    $.ajax({
        url: url,
        method: method,
        data: {counter: counter},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            block.find('tbody').append(parse_data.content);
            if(parse_data.has_load == '1'){
                $(link).find('a').text(parse_data.load_link);
            }
            else{
                $(link).addClass('hidden-block');
            }
        }
    });

    return false;
});

// таб фурнитуры
$(document).on('click', '.page-furniture ul.tabs__caption-list li:not(.active) label', function() {
  $(this).parents('li').addClass('active').siblings().removeClass('active');
  $(this).closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).parents('li').index()).addClass('active');
  $(this).parents('.tabs').find('div.tabs__caption-filter').find('div.furniture-filter').removeClass('active').find('input').prop('disabled', 'disabled');
  $(this).parents('.tabs').find('div.tabs__caption-filter').find('div.furniture-filter').eq($(this).parents('li').index()).addClass('active').find('input').prop('disabled', false);

});

$(document).on('click', '.furniture-filter label', function(){
    var block = $(".tabs__content.active").find("ul");
    var form = $(this).parents('form');
    var method = form.attr('metod');
    var url = form.attr('action');
    var link = block.find('.furniture__more');
    setTimeout(function(){
        $.ajax({
            url: url,
            method: method,
            data: form.serialize(),
            success: function (data) {
                var parse_data = jQuery.parseJSON(data);
                block.empty().append(parse_data.content);
                if(parse_data.has_load == '1'){
                    $(link).find('a').text(parse_data.load_link);
                }
                else{
                    $(link).addClass('hidden-block');
                }
            }
        });
    }, 10)
});
