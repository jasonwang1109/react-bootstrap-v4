import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ReactDOM from "react-dom";
import {GetDomXY} from "./Common";

class HScroll extends React.PureComponent {
    constructor(props) {
        super(props);
        this.parent = this.props.parent || null;
        //scroll speed
        this.wheelSpeed = this.props.speed/10;
        //scroll height to component height Proportion
        this.scrollProportion = 0;
        //scroll offset left
        this.offsetLeft = 0;
        //display status
        this.isShow = false;
        //move xy
        this.x = 0;
        this.y = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        //scroll top xy
        this.domXY = {};
        //parent scroll dom
        this.alignParent = null;
    }

    componentDidMount() {
        this.initParentEvent();
    }

    initParentEvent() {
        if (this.parent) {
            this.parentDom = ReactDOM.findDOMNode(this.parent);
        } else {
            this.parentDom = document.querySelector(this.props.selector);
        }

        if (this.parentDom) {
            this.parentDom.classList.add('ck-scroll-over');
            this.parentDom.addEventListener('wheel',this.scrollHandler,false);
            this.parentDom.addEventListener('mouseover',this.showHandler,false);
            this.parentDom.addEventListener('mouseout',this.hideHandler,false);
        }

        // this.dom.addEventListener("mousedown",this.beginDragHandler,false);
        this.dom.addEventListener("wheel",this.scrollHandler,false);

        if (this.props.alignParent) {
            this.initAlignParent();
        }
    }
    //align parent scroll bottom
    initAlignParent() {
        let e = this.dom;
        while ((e = e.offsetParent) && e.scrollHeight === e.clientHeight) {

        }
        if (e === null) {
            e = document.documentElement;
        }

        this.alignParent = e;
        if (this.alignParent === document.documentElement) {
            document.addEventListener('scroll',()=>{
                this.setPosition();
            },false);
        } else {
            this.alignParent.addEventListener('scroll',()=>{
                this.setPosition();
            },false);
        }
    }

    setPosition() {
        let scrollTop = this.alignParent.scrollTop;
        let clientHeight = this.alignParent.clientHeight;
        let bottom = this.parentDom.clientHeight + this.domXY.top - clientHeight - scrollTop;
        if (bottom < 0) {
            this.dom.style.bottom = 0;
        } else {
            this.dom.style.bottom = bottom + 2 + 'px';
        }
    }

    getClasses() {
        let base = 'ck-scroll ck-scroll-h';

        return classNames(base,this.props.className);
    }

    showHandler = (e)=>{
        this.scrollProportion = this.parentDom.offsetWidth/this.parentDom.scrollWidth;
        if (this.scrollProportion === 1) {
            return;
        }
        this.scrollDom.style.width = (this.parentDom.offsetWidth*this.scrollProportion) + 'px';
        // this.dom.style.top = this.parentDom.offsetTop+'px';
        this.dom.style.width = this.parentDom.offsetWidth+'px';
        this.scrollDom.style.left = (this.parentDom.scrollLeft * this.scrollProportion) + 'px';
        this.dom.classList.add('ck-scroll-show');
        this.isShow = true;

        this.domXY = GetDomXY(this.dom.offsetParent,this.alignParent);

        this.setPosition();
    };

    hideHandler = (e)=>{
        this.isShow = false;
        this.dom.classList.remove('ck-scroll-show');
    };

    scrollHandler = (e)=>{
        if (e.deltaX !== 0) {
            e.preventDefault();
        }
        if (!this.isShow) {
            this.showHandler();
        }
        this.setScrollLeft(this.parentDom.scrollLeft+(e.deltaX * this.wheelSpeed));
    };

    scrollClickHandler = (e)=>{
        this.setBarLeft(e.pageX-this.domXY.left-this.scrollDom.clientWidth/2);
        // this.scrollX = parseInt(this.scrollDom.style.left);
        // this.scrollY = parseInt(this.scrollDom.style.top);
        // this.x = parseInt(e.pageX);
        // this.y = parseInt(e.pageY);
        this.beginDragHandler(e);
    };

    beginDragHandler = (e)=>{
        e.stopPropagation();
        e.preventDefault();
        this.scrollX = parseInt(this.scrollDom.style.left);
        this.x = parseInt(e.pageX);
        this.dom.classList.add('ck-scroll-scrolling-h');
        window.addEventListener('mousemove',this.moveDragHandler,false);
        window.addEventListener('mouseup',this.endDragHandler,false);
    };

    moveDragHandler = (e)=>{
        this.setBarLeft((parseInt(e.pageX) - this.x)+this.scrollX);
    };

    endDragHandler = (e)=>{
        this.dom.classList.remove('ck-scroll-scrolling-h');
        window.removeEventListener('mousemove',this.moveDragHandler);
        window.removeEventListener('mouseup',this.endDragHandler);
    };

    setScrollLeft(left) {
        this.parentDom.scrollLeft = left;
        this.scrollDom.style.left = (this.parentDom.scrollLeft * this.scrollProportion) + 'px';
    }

    setBarLeft(left) {
        if (left < 0) {
            left = 0;
        } else if (left > this.dom.clientWidth-this.scrollDom.clientWidth) {
            left = this.dom.clientWidth-this.scrollDom.clientWidth;
        }
        this.scrollDom.style.left = left + 'px';
        this.parentDom.scrollLeft = left/this.scrollProportion;
    }

    render() {
        return (
            <div ref={c=>this.dom=c} className={this.getClasses()} onMouseDown={this.scrollClickHandler}>
                <div ref={c=>this.scrollDom=c} className='ck-scroll-bar ck-scroll-bar-h' onMouseDown={this.beginDragHandler}/>
            </div>
        );
    }
}

HScroll.propTypes = {
    parent: PropTypes.any,
    selector: PropTypes.string,
    speed: PropTypes.number,
    align: PropTypes.oneOf(['top','bottom']),
    alignParent: PropTypes.bool,
};

HScroll.defaultProps = {
    speed: 5,
    align: 'bottom',
    alignParent: false,
};

export default HScroll;