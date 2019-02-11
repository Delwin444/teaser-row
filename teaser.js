let TeaserRow = function (element) {
    let onEscapeDownFunction = function (event) {
        let isEscape = false;
        event = event || window.event;

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
    let length = this.teaserList.length;

    for (let i = 0; i < length; i++) {
        callback(this.teaserList[i]);
    }
};

TeaserRow.prototype.registerTeaserElementsClickEvent = function () {
    this.forEachTeaser(function (teaser) {
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
    let teaserBounding = this.openedTeaser.getBoundingClientRect(),
        teaserContent = this.openedTeaser.querySelector('.teaser__content'),
        teaserContentHtml = teaserContent.innerHTML,
        doc = document.documentElement;

    this.teaserOverlayContent = document.createElement('div');
    this.teaserOverlayContent.classList.add('teaser__content');
    this.teaserOverlayContent.innerHTML = teaserContentHtml;

    this.teaserOverlay = document.createElement('div');
    this.teaserOverlay.id = 'teaser-overlay';

    this.teaserOverlay.style.backgroundImage = window.getComputedStyle(this.openedTeaser.getElementsByTagName('div')[0]).backgroundImage;
    this.teaserOverlay.style.height = teaserBounding.height + 'px';
    this.teaserOverlay.style.width = teaserBounding.width + 'px';
    this.teaserOverlay.style.top = teaserBounding.top + 'px';
    this.teaserOverlay.style.left = teaserBounding.left + 'px';

    this.teaserOverlay.innerHTML = '<div class="close icon-cross"></div>';
    document.body.appendChild(this.teaserOverlay);

    this.teaserOverlay.appendChild(this.teaserOverlayContent);

    window.requestAnimationFrame(function () {
        this.teaserOverlay.style.left = '0';
        this.teaserOverlay.style.top = '0';
        this.teaserOverlay.style.width = '100%';
        this.teaserOverlay.style.height = '100vh';

        setTimeout(function () {
            this.teaserOverlay.style.transition = 'all 0s';
            this.teaserOverlay.classList.add('opened');
        }.bind(this), 500);

    }.bind(this));

    this.teaserOverlay.getElementsByClassName('close')[0].addEventListener('click', this.onCloseTeaserClick.bind(this));

    document.body.style.marginTop = '-' + (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0) + 'px';
    document.body.classList.add('scroll-blocked');
};

TeaserRow.prototype.closeTeaserOverlay = function () {
    let toScrollPosition = document.body.style.marginTop;

    document.body.classList.remove('scroll-blocked');
    document.body.style.removeProperty('margin-top');

    this.teaserOverlay.style.transition = 'all .5s';
    this.teaserOverlay.style.opacity = 0;
    this.teaserOverlay.style.pointerEvents = 'none';

    setTimeout(function () {
        this.teaserOverlay.parentNode.removeChild(document.getElementById('teaser-overlay'));
    }.bind(this), 500);

    window.scrollTo(0, parseInt(toScrollPosition.substr(1, toScrollPosition.length - 3), 10));
};

new TeaserRow(document.querySelector('.teaser-row'));