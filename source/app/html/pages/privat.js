setTimeout(function() {
    if ($('.page-privat .inp-styled').length) {
        $('.page-privat .inp-styled').each(function () {
            $(this).styler({
                onSelectClosed: function () {
                }
            });
        })
    }

    // добавить новый адрес
    $(document).on('click', '.js--add-adress', function(){
        var url = $(this).attr('data-url');
        var method = $(this).attr('data-method');

        $.ajax({
            url: url,
            method: method,
            success: function (data) {
                $('.filter-wrap').append(data);
            }
        });
        return false;
    });
},10)