/**
 * 动态加载组件
 */
import React from 'react';
import PropTypes from "prop-types";

export default class LoaderComponent extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            instance:null,
            noFound:false
        };
    }

    componentDidMount() {
        this.loadComponent(this.props.loadPath);
    }

    componentWillReceiveProps(nextProp) {
        if (this.props.loadPath !== nextProp.loadPath) {
            this.loadComponent(nextProp.loadPath);
        }
    }

    loadComponent(loadPath) {
        if (this.props.modal) {
            GetModalView(loadPath).then(this.setComponent);
        } else {
            GetComponent(loadPath).then(this.setComponent);
        }
    }

    setComponent = (component)=>{
        if (typeof component === "string") {
            this.setState({
                noFound:true
            });
        } else {
            this.setState({
                instance:component
            });
        }
    };

    render() {
        if (this.state.instance) {
            return this.renderComponent()
        } else {
            return (
                <div>
                    {this.state.noFound?'没有找到模块':'加载中...'}
                </div>
            );
        }
    }

    renderComponent() {
        let Instance = this.state.instance;
        return <Instance {...this.props}/>;
    }
}

LoaderComponent.propTypes = {
    loadPath: PropTypes.string,
    modal: PropTypes.bool
};

LoaderComponent.defaultProps = {
    loadPath:""
};

function GetComponent(path) {
    console.log(path);
    return import(`../view${path}`).then(component=>{
        return component.default;
    }).catch(error=>{
        console.log(path);
        return 'An error occurred while loading the component '+error
    });
}

function GetModalView(path) {
    console.log(path);
    return import(`../modalview${path}`).then(component=>{
        return component.default;
    }).catch(error=>{
        console.log(path);
        return 'An error occurred while loading the component '+error
    });
}