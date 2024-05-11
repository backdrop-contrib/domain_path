(function ($) {

  Backdrop.behaviors.domainPath = {
    attach: function (context, settings) {
      Backdrop.domainPath.init(context);
    }
  };

  /**
   * Function to check for checked state in domain access options, and only show
   * domain path fields if the domain access is enabled.
   */
  Backdrop.domainPath = {
    /**
     * Determine Domain selection format.
     */
    domainSelectorType: function () {
      return Backdrop.settings.domainPath.fieldType == 0 ? 'checkbox' : 'select';
    },
    /**
     * Select a selector depending on the domain selection format.
     */
    domainSelector: function () {
      return Backdrop.domainPath.domainSelectorType() === 'checkbox' ? '#edit-domains .form-checkbox' : '#edit-domains.form-select';
    },
    init: function (context) {
      // Initial state for path fields.
      Backdrop.domainPath.showHideAll();

      // The user doesn't have access to the domain settings so go ahead and
      // show the path field for domain that was set from the form.
      if (Backdrop.settings.hasOwnProperty('domainPath') && Backdrop.settings.domainPath.hasOwnProperty('domainId')) {
        Backdrop.domainPath.showHide(Backdrop.settings.domainPath.domainId, 'show');
      }

      // Check to see if Publish to all is checked, if so, show all fields
      $('#edit-domain-site').bind('change', function () {
        Backdrop.domainPath.showHideAll();
      });

      // Bind the click event on the SelectorType and check for "checked" then
      // hide or show the domain path div accordingly.
      $(Backdrop.domainPath.domainSelector()).change(function () {
        Backdrop.domainPath.showHideSelectedDomain(this);
      });
    },

    /**
     * Determine the state of the "Publish to all" checkbox.
     */
    isDomainSite: function () {
      if ($('#edit-domain-site').is(':checked')) {
        return true;
      }
      else {
        return false;
      }
    },

    /**
     * Update visibility of all domain path inputs.
     */
    showHideAll: function () {
      // Hide all just incase the user doesn't have access to all domains.
      $('#edit-domain-path .form-type-textfield').css('display', 'none');
      $(Backdrop.domainPath.domainSelector()).each(function (index) {
        Backdrop.domainPath.showHideSelectedDomain(this);
      });
    },

    /**
     * Show or hide the path field for the corresponding domain.
     */
    showHide: function (domainId, state) {
      var selectorType = Backdrop.domainPath.domainSelectorType();
      var isDomainSite = Backdrop.domainPath.isDomainSite();

      if (selectorType === 'checkbox') {
        Backdrop.domainPath.showHideCheckbox(domainId, isDomainSite, state);
      }
      if (selectorType === 'select') {
        Backdrop.domainPath.showHideSelect(domainId, isDomainSite, state);
      }
    },

    /**
     * Show or hide the path field for select.
     */
    showHideSelect: function (domainId, isDomainSite, state) {
      domainId = domainId !== null ? domainId.map(Number) : [];

      $('[name*=domain_path]').each(function () {
        var domain_path = $(this).data('domain_id');
        var pathSelector = '.form-item-domain-path-' + domain_path;

        if (isDomainSite === true || $.inArray(domain_path, domainId) !== -1 || state === 'show') {
          $(this).closest(pathSelector).show();
        }
        else {
          $(this).closest(pathSelector).hide();
        }
      });
    },

    /**
     * Show or hide the path field for checkbox.
     */
    showHideCheckbox: function (domainId, isDomainSite, state) {
      var pathSelector = '.form-item-domain-path-' + domainId;
      if (state === 'show' || isDomainSite === true) {
        $(pathSelector).show();
      }
      else {
        $(pathSelector).hide();
      }
    },

    /**
     * Show or hide each the path field depending on its corresponding access
     * options state.
     */
    showHideSelectedDomain: function (selector) {
      var domainId = $(selector).val();

      if ($(selector).is(':checked')) {
        Backdrop.domainPath.showHide(domainId, 'show');
      }
      else {
        Backdrop.domainPath.showHide(domainId);
      }
    }
  }
})(jQuery);
