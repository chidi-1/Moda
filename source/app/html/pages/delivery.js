
setTimeout(function() {
    if ($('#mapmosc').length && $('.page-delivery').length) {
        var point = $('#mapmosc').attr('data-point')
        ymaps.ready(init);

        function init() {
            var myMap = new ymaps.Map('mapmosc', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

             $.ajax({
                url: point
             }).done(function(data) {
                objectManager.add(data);
             });
        }
    }
    if ($('#mapsptb').length && $('.page-delivery').length) {
        var point = $('#mapsptb').attr('data-point')
        ymaps.ready(initspb);

        function initspb() {

            var myMap = new ymaps.Map('mapsptb', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: point
            }).done(function(data) {
                objectManager.add(data);
            });
        }
    }
}, 10);

 $(document).on('click', '.sub--title', function(){
     $(this).parents('li').toggleClass('open')
 })