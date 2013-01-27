$(function (){

    //Namespacing
    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    //Questions Collection
    App.Collections.Questions = Backbone.Collection.extend({
        model: App.Models.Questions,
    });

    //Question view - using the #questions template
    App.Views.QuestionView = Backbone.View.extend({
        el: $('#questions'),
        template: $('#question-tmpl').template(),

        render: function ()
        {
            this.el.empty();
            $.tmpl(this.template, this.model.toArray()).appendTo(this.el);
            return this;
        }
    });

    //Answers view - using the #answers template
    App.Views.Answers = Backbone.View.extend({
        el: $('#answers'),
        template: $('#answers-tmpl').template(),

        render: function ()
        {
            this.el.empty();
            $.tmpl(this.template, this.model).appendTo(this.el);
            return this;
        }
    });

    //setup the routes
    App.Router.Router = Backbone.Router.extend({
        //clear memory leaks
        _data: null,
        _items: null,
        _view: null,

        //only really need one route that isnt default
        routes: {
            "question/:id": "showQuestion"
        },
        //init function to pull in the json via ajax
        initialize: function (options)
        {
            var _this = this;
            $.ajax({
                url: "data/questions.json",
                dataType: 'json',
                data: {},
                async: false,
                success: function (data)
                {
                    _this._data = data;
                    _this._items = new App.Collections.Questions(data);
                    _this._view = new App.Views.QuestionView ({ model: _this._items });
                    _this._view.render();
                }
            });
            return this;
        },

        //show info method to return the correct answers to the correct question and add/remove active classes
        showQuestion: function (id)
        {
            var view = new App.Views.Answers({ model: this._items.at(id - 1) });
            $(".active").removeClass("active");
            $("#question" + id).addClass("active");
            view.render();
        }
    });
    
    //start the app please!
    new App.Router.Router;
    //then make sure we can use bookmarkable URLs
    Backbone.history.start();
});

