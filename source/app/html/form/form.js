function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).on('focus', 'input', function(){
    $(this).removeClass('error');
    $('.error-text').text('')
});
$(document).on('focus', 'textarea', function(){
    $(this).removeClass('error');
    $('.error-text').text('')
});

// ФОРМЫ В ПОПАПАХ

$(document).on('click', '.js--show-pass', function() {
    if($(this).hasClass('icon-eye-open')){
        $(this).prev('.input-pass').attr('type','text')
    }
    else{
        $(this).prev('.input-pass').attr('type','password')
    }
    $(this).toggleClass('icon-eye-open icon-eye-close')
});

$(document).on('blur', '.input-mail', function() {
    if(!($(this).prop('value') == undefined || $(this).prop('value') == '')){
        if(validateEmail($(this).prop('value')) == false){
            $(this).addClass('error');
        }
    }
});

// отправка формы из попапа с подробностями

$(document).on('click', '.js--send-popup-item', function(){
    $(this).parents('form').trigger('submit');
})

// отправка формы
$(document).on('click', '.js--form-submit', function () {

    var form =  $(this).parents('.main-form');
    var errors = false;

    $(form).find('.required').each(function(){
        var val=$(this).prop('value');
        if(val==''){
            $(this).addClass('error');
            errors=true;
        }
        else{
            if($(this).hasClass('inp-mail')){
                if(validateEmail(val) == false){
                    $(this).addClass('error');
                    errors=true;
                }
            }
        }
    });

    if(errors == false){
        var button_value = $(form).find('.js--form-submit').prop('value');
        $(form).find('.js--form-submit').prop('value', 'Подождите...');

        var method = form.attr('method');
        var action = form.attr('action');
        var data = form.serialize();
        $.ajax({
            type: method,
            url: action,
            data: data,
            success: function(data) {
                var parse_data = jQuery.parseJSON(data);
                if(parse_data.error == '1' && (form.hasClass('enter-form') || form.hasClass('forgot-form') || form.hasClass('reg-form') || form.hasClass('pass-form'))){
                    $('.error-text').text(parse_data.error_text)
                }
                else{
                    // форма входа
                    if(form.hasClass('enter-form')){
                        window.location = window.location.href
                    }

                    // форма восстановления пароля
                    if(form.hasClass('forgot-form')){
                        $('.js--pass-ok').trigger('click')
                    }

                    // форма установки нового пароля
                    if(form.hasClass('pass-form')){
                        $('.js--new-pass-ok').trigger('click')
                    }

                    // форма регистрации
                    if(form.hasClass('reg-form')){
                        window.location = window.location.href
                    }

                    // сохранение адреса доставки
                    if(form.hasClass('delivery-form')){
                        window.location = window.location.href
                    }

                    // форма отзыва
                    if(form.hasClass('review-form')){
                        form.find('input').each(function(){$(this).prop('value','')});
                        form.find('textarea').prop('value','');
                        $('.js--review-ok').trigger('click')
                    }
                }
            },
            error: function(data) {
                $(form).find('.js--form-submit').prop('value','Ошибка');
                setTimeout(function() {
                    $(form).find('.js--form-submit').prop('value', button_value);
                }, 2000);
            }
        });
    }
    return false;


});
