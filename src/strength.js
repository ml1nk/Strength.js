/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
(function($, window, document, undefined) {

  var pluginName = "strength",
    defaults = {
      strengthClass: 'strength',
      strengthMeterClass: 'strength_meter',
      strengthButtonClass: 'button_strength',
      strengthButtonText: 'Show Password',
      strengthButtonTextToggle: 'Hide Password',
      showPasswordToggle: true,
      veryWeakText: 'very weak',
      weakText: 'weak',
      mediumText: 'medium',
      strongText: 'strong',
      strengthText: 'Strength'
    };

  // $('<style>body { background-color: red; color: white; }</style>').appendTo('head');

  function Plugin(element, options) {
    this.element = element;
    this.$elem = $(this.element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {

    init: function() {
      var characters = 0;
      var capitalletters = 0;
      var loweletters = 0;
      var number = 0;
      var special = 0;
      var self = this;

      var upperCase = new RegExp('[A-Z]');
      var lowerCase = new RegExp('[a-z]');
      var numbers = new RegExp('[0-9]');
      var specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

      function GetPercentage(a, b) {
        return ((b / a) * 100);
      }

      function check_strength(thisval, thisid) {
        if (thisval.length > 8) {
          characters = 1;
        } else {
          characters = -1;
        }
        if (thisval.match(upperCase)) {
          capitalletters = 1;
        } else {
          capitalletters = 0;
        }
        if (thisval.match(lowerCase)) {
          loweletters = 1;
        } else {
          loweletters = 0;
        }
        if (thisval.match(numbers)) {
          number = 1;
        } else {
          number = 0;
        }
        if (thisval.match(specialchars)) {
          special = 1;
        } else {
          special = 0;
        }

        var total = characters + capitalletters + loweletters + number + special;
        var totalpercent = GetPercentage(7, total).toFixed(0);

        if (!thisval.length) {
          total = -1;
        }

        get_total(total, thisid);
      }

      function get_total(total, thisid) {

        var thismeter = $('div[data-meter="' + thisid + '"]');

        thismeter.removeClass();
        if(total == -1) {
          thismeter.html(self.options.strengthText);
        }else if (total <= 1) {
          thismeter.addClass('veryweak').html(self.options.veryWeakText);
        } else if (total == 2) {
          thismeter.addClass('weak').html(self.options.weakText);
        } else if (total == 3) {
          thismeter.addClass('weak').html(self.options.weakText);
        } else if (total == 4) {
          thismeter.addClass('medium').html(self.options.mediumText);
        } else {
          thismeter.addClass('strong').html(self.options.strongText);
        }
      }

      var isShown = false;
      var strengthButtonText = this.options.strengthButtonText;
      var strengthButtonTextToggle = this.options.strengthButtonTextToggle;

      var showPasswordToggle = this.options.showPasswordToggle;
      var passwordToggle = "";

      var thisid = this.$elem.attr('id');

      if (showPasswordToggle) {
        passwordToggle = '<a data-password-button="' + thisid + '" href="" class="' + this.options.strengthButtonClass + '">' + this.options.strengthButtonText + '</a>';
      }

      this.$elem.addClass(this.options.strengthClass).attr('data-password', thisid)
          .after('<input style="display:none" class="' + this.options.strengthClass + ' ' + this.$elem.attr('class') + '" data-password="' +
          thisid + '" type="text" name="" value="">'+passwordToggle+'<div class="' + this.options.strengthMeterClass + '"><div data-meter="' + thisid + '">'+this.options.strengthText+'</div></div>');

      this.$elem.bind('keyup keydown', function(event) {
        var thisval = $('#' + thisid).val();
        $('input[type="text"][data-password="' + thisid + '"]').val(thisval);
        check_strength(thisval, thisid);
      });

      $('input[type="text"][data-password="' + thisid + '"]').bind('keyup keydown', function(event) {
        var thisval = $('input[type="text"][data-password="' + thisid + '"]').val();
        $('input[type="password"][data-password="' + thisid + '"]').val(thisval);
        check_strength(thisval, thisid);
      });

      $(document.body).on('click', '.' + this.options.strengthButtonClass, function(e) {
        e.preventDefault();
        var thisclass = 'hide_' + $(this).attr('class');

        if (isShown) {
          $('input[type="text"][data-password="' + thisid + '"]').hide();
          $('input[type="password"][data-password="' + thisid + '"]').show().focus();
          $('a[data-password-button="' + thisid + '"]').removeClass(thisclass).html(strengthButtonText);
          isShown = false;
        } else {
          $('input[type="text"][data-password="' + thisid + '"]').show().focus();
          $('input[type="password"][data-password="' + thisid + '"]').hide();
          $('a[data-password-button="' + thisid + '"]').addClass(thisclass).html(strengthButtonTextToggle);
          isShown = true;
        }
      });
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
