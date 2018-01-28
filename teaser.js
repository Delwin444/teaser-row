var TeaserRow = function (element) {
    var onEscapeDownFunction = function (event) {
        event = event || window.event;
        var isEscape = false;
        // console.log(event.key);
        if (event['key'] !== undefined) {
            isEscape = (event.key === 'Escape' || event.key === 'Esc');
        } else {
            isEscape = (event.keyCode === 27);
        }
        if (isEscape) {
            this.closeTeaser();
        }
    }.bind(this);

    this.getOnEscapeDownFunction = function (event) {
        return onEscapeDownFunction(event);
    };

    this.teaserRow = element;
    this.teaserList = this.teaserRow.getElementsByClassName('teaser');

    this.registerTeaserElementsClickEvent();
};


/**
 * @param {Function} callback
 */
TeaserRow.prototype.forEachTeaser = function (callback) {
    var length = this.teaserList.length;
    for (var i = 0; i < length; i++) {
        callback(this.teaserList[i]);
    }
};

TeaserRow.prototype.registerTeaserElementsClickEvent = function () {
    this.forEachTeaser(function(teaser) {
        teaser.addEventListener('click', this.onTeaserClick.bind(this));
    }.bind(this));
};

TeaserRow.prototype.onTeaserClick = function (event) {
    /*
     * Do nothing, if teaser is already opening
     */
    if (document.getElementById('teaser-overlay') !== null) {
        return;
    }

    /**
     * @type {Node}
     */
    this.openedTeaser = event.currentTarget;
    window.requestAnimationFrame(function () {
        this.openedTeaser.classList.add('opened');
        this.openedTeaser.classList.add('finish');

        window.requestAnimationFrame(function () {
            this.openTeaserOverlay();
            document.addEventListener('keydown', this.getOnEscapeDownFunction, true);
        }.bind(this));

    }.bind(this));
};

TeaserRow.prototype.onCloseTeaserClick = function () {
    this.closeTeaser();
};


TeaserRow.prototype.closeTeaser = function () {
    document.removeEventListener('keydown', this.getOnEscapeDownFunction, true);
    this.openedTeaser.classList.remove('opened');
    this.openedTeaser.classList.remove('finish');
    this.closeTeaserOverlay();
};

TeaserRow.prototype.openTeaserOverlay = function () {
    // window.location.href = window.location.href.substr(window.location.href.lastIndexOf('/') + 1) + '/' + this.openedTeaser.id;
    // window.history.pushState('page', this.openedTeaser.id, this.openedTeaser.id);
    var teaserBounding = this.openedTeaser.getBoundingClientRect();
    var teaserContent = this.openedTeaser.querySelector('.teaser__content');
    var teaserContentHtml = teaserContent.innerHTML;
    this.teaserOverlayContent = document.createElement('div');
    this.teaserOverlayContent.classList.add('teaser__content');
    this.teaserOverlayContent.innerHTML = teaserContentHtml;

    this.teaserOverlay = document.createElement('div');
    this.teaserOverlay.style.backgroundImage = window.getComputedStyle(this.openedTeaser.getElementsByTagName('div')[0]).backgroundImage;
    this.teaserOverlay.id = 'teaser-overlay';
    this.teaserOverlay.style.height = teaserBounding.height + 'px';
    this.teaserOverlay.style.width = teaserBounding.width + 'px';
    this.teaserOverlay.style.top = teaserBounding.top + 'px';
    this.teaserOverlay.style.left = teaserBounding.left + 'px';
    this.teaserOverlay.innerHTML = '<div class="close icon-cross"></div>';
    document.body.appendChild(this.teaserOverlay);
    this.teaserOverlay.appendChild(this.teaserOverlayContent);
    window.requestAnimationFrame(function() {
        this.teaserOverlay.style.left = 0;
        this.teaserOverlay.style.top = 0;
        this.teaserOverlay.style.width = '100%';
        this.teaserOverlay.style.height = '100vh';
        setTimeout(function() {
            this.teaserOverlay.style.transition = 'all 0s';
            this.teaserOverlay.classList.add('opened');
        }.bind(this), 500);
    }.bind(this));
    this.teaserOverlay.getElementsByClassName('close')[0].addEventListener('click', this.onCloseTeaserClick.bind(this));
    var doc = document.documentElement;
    document.body.style.marginTop = '-' + (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0) + 'px';
    document.body.classList.add('scroll-blocked');
};

TeaserRow.prototype.closeTeaserOverlay = function () {
    document.body.classList.remove('scroll-blocked');
    var toScrollPosition = document.body.style.marginTop;
    document.body.style.removeProperty('margin-top');
    this.teaserOverlay.style.transition = 'all .5s';
    this.teaserOverlay.style.opacity = 0;
    this.teaserOverlay.style.pointerEvents = 'none';
    setTimeout(function() {
        this.teaserOverlay.parentNode.removeChild(document.getElementById('teaser-overlay'));
    }.bind(this), 500);
    window.scrollTo(0, toScrollPosition.substr(1, toScrollPosition.length - 3));
};

new TeaserRow(document.querySelector('.teaser-row'));