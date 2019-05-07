var SuwonDefender = {
  settings: {},

  getImageNaturalSize: function getImageNaturalSize($img) {
    $img = $($img);

    //IE 8 이하를 위한 보정
    if (!$img[0].naturalWidth && !$img.data('naturalWidth')) {
      var tempImage = new Image();
      tempImage.src = $img[0].src;
      $img.data({
        'naturalWidth': tempImage.width,
        'naturalHeight': tempImage.height
      });
    }

    return {
      width:  $img[0].naturalWidth  || $img.data('naturalWidth'),
      height: $img[0].naturalHeight || $img.data('naturalHeight'),
    };
  },

  updateImageMapCoords: function updateImageMapCoords() {
    var self = this;
    var coordArrays = this.imageMapCoordinates;

    $('map').each(function () {
      var $image = $('img.toggle[usemap="#' + this.name + '"]');
      var naturalSize = self.getImageNaturalSize($image);
      var widthRatio  = $image.width()  / naturalSize.width;
      var heightRatio = $image.height() / naturalSize.height;

      $(this).children('area').each(function () {
        var coords = coordArrays[ $(this).data('toggle-id') ].slice();
        for (var x = 0, y = 1; y < coords.length; x += 2, y += 2) {
          coords[x] = Math.round(coords[x] * widthRatio);
          coords[y] = Math.round(coords[y] * heightRatio);
        }
        this.coords = coords.join();
      });
    });
  },

  initializeImageMaps: function initializeImageMaps() {
    $(document.body).on('click', 'area', function () {
      $('#' + $(this).data('toggle-id')).toggle();
      return false;
    });

    this.updateImageMapCoords();
    var self = this;
    $(window).resize(function () { self.updateImageMapCoords(); });
  },

  initializeMenu: function initializeMenu($menuElem) {
    var self = this;
    var $menu = $($menuElem).children('ul');

    $menu.menu({
      icons: { submenu: "ui-icon-carat-1-s" },
      position: { my: 'left top', at: 'left bottom' },
      select: function (event, ui) {
        if (ui.item.hasClass('boolean')) {
          self.activateMenuItem(ui.item, !ui.item.hasClass('menu--active'));
        }
        else if (ui.item.hasClass('option')) {
          self.activateMenuItem(ui.item, true);
          self.activateMenuItem(ui.item.siblings(), false);
          ui.item.parent().siblings('.menu-item-text').text(ui.item.text());
        }
      }
    });

    //메뉴의 크기를 고정
    $menu.children('.ui-menu-item').each(function () {
      var $menuItem = $(this), width = Math.round($menuItem.width());
      $menuItem.width(width + 5);
    });
    // this.resizeMenu($menu);
    // $(window).resize(function () {
    //   self.resizeMenu($menu);
    // });
  },

  activateMenuItem: function activateMenuItem($menuItem, bActivate) {
    if (arguments.length < 2)
      bActivate = true;

    $menuItem.toggleClass('menu--active', bActivate);
    /*$menuItem.children('.ui-icon')
             .toggleClass('ui-icon-blank', !bActivate)
             .toggleClass('ui-icon-check', bActivate); /**/

    if ($menuItem.hasClass('boolean')) {
      var toggleImageId = $menuItem.data('toggle-id');
      if (!toggleImageId) return;

      // var $toggleImage = $('img.toggle[src$="images/' + toggleImageId + '"]');
      var $toggleImage = $('#' + toggleImageId);
      if (!$toggleImage.length) return;

      $toggleImage.toggle(bActivate);

      var bHasToggleImageMap = $menuItem.data('toggle-imagemap');
      if (!bHasToggleImageMap) return;

      var $toggleImageMap = $('#' + toggleImageId +'-imagemap').toggle();
      if ($toggleImageMap.is(':hidden')) {
        $('map[name="' + toggleImageId + '"]').children('area').each(function () {
          $('#' + $(this).data('toggle-id')).hide();
        });
      }
    }
  },

  resizeMenu: function resizeMenu($menu) {
    var docWidth = $(document).width();
    var $menuItems = $menu.children('.ui-menu-item');

    var recommendedWidth = Math.floor(docWidth / $menuItems.length) - 8;
    // $menuItems.outerWidth(recommendedWidth);
    $menuItems.children('.ui-menu').addBack().outerWidth(recommendedWidth);
  },

  initializeIcons: function initializeIcons($iconBar, $map) {
    $($iconBar).find('img').draggable({
      helper: 'clone',
      containment: $map,
      appendTo: $map,
      stop: function (event, ui) {
        var $newIcon = $('<img class="icon icon--on-map">')
          .attr('src', this.src);

        var iconGroup = $(this).data('icongroup');
        if (iconGroup) {
          $newIcon.data('icongroup-dialog', SuwonDefender.iconGroupDialogs[iconGroup]);
        }

        $newIcon.appendTo($map)
          .offset(ui.offset)
          .draggable({ containment: 'parent' })
          .click(onIconClick);
          //주의: click 이벤트를 draggable() 다음에 놓아야 클릭/드래그 이벤트가 올바르게 구분되어 처리됨!
      }
    });

    function onIconClick() {
      var $self = $(this);
      var $iconGroupDialog = $self.data('icongroup-dialog');
      if ($iconGroupDialog) {
        $iconGroupDialog.data('icon-element', $self)
          .dialog('option', 'position', { 'my': 'left top', 'of': $self })
          .dialog('open');
      }
      else {
        $self.remove();
      }
    }
  },

  initializeIconGroupDialogs: function initializeIconGroupDialogs() {
    this.iconGroupDialogs = {};
    this.iconGroupDialogs['eod'] = $('<div class="icon-group-dialog">').appendTo(document.body).dialog({
      autoOpen: false,
      resizable: false,
      draggable: false,
      modal: true,
      width: 40, minWidth: 150, minHeight: 40,
      title: '아이콘 선택',
      buttons: {
        '삭제' : function () {
          $(this).dialog('close').data('icon-element').remove();
        }
      }
    });

    this.iconGroupDialogs['eod'].html(
      '<img class="icon" src="images/icons/eod.png">'
      + '<img class="icon" src="images/icons/eod2.png">'
      + '<img class="icon" src="images/icons/eod3.png">'
    );

    $(document.body).on('click', '.icon-group-dialog img.icon', function () {
      var $dialog = $(this).parents('.icon-group-dialog');
      var $icon = $dialog.data('icon-element');
      if ($icon) {
        $icon.attr('src', this.src);
      }
      $dialog.dialog('close');
    });
  },

  getDocumentModeString: function getDocumentModeString() {
    var str = 'compatMode : ' + document.compatMode;
    if (document.compatMode === 'BackCompat')
      str += '(not standards-compliant)';
    else if (document.compatMode === 'CSS1Compat')
      str += '(standards-compliant)';

    str += ' / documentMode : ' + document.documentMode;
    switch (document.documentMode) {
      case 0: str += '(not determined yet)'; break;
      case 5: str += '(IE5 mode(quirks mode))'; break;
      case 7: str += '(IE7 standards mode)'; break;
      case 8: str += '(IE8 standards mode)'; break;
      case 9: str += '(IE9 standards mode)'; break;
      case 10: str += '(IE10 standards mode)'; break;
    }

    return str;
  }
};

/* global $ */
