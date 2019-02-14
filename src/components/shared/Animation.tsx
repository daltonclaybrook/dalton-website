import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const FadeOut = styled.div`
    animation: ${fadeOut} 1s linear;
`;

const FadeIn = styled.div`
    animation: ${fadeIn} 1s linear;
`;

enum AnimationState {
    Idle,
    FadeOut,
    FadeIn,
}

interface FaderProps<T> {
    new: T;
    old?: T;
    setCurrent(value: T): void;
}

interface FaderState {
    animationState: AnimationState;
}

class Fader<T> extends Component<FaderProps<T>, FaderState> {
    constructor(props: FaderProps<T>) {
        super(props);
        this.state = {
            animationState: AnimationState.Idle,
        };
        if (props.old) {
            props.setCurrent(props.old);
        }
    }

    public componentDidUpdate = () => {
        console.log('did update');
        if (this.state.animationState !== AnimationState.Idle) {
            this.setState({ animationState: AnimationState.FadeOut });
        }
    }

    public componentDidMount = () => {
        console.log('did mount');
        const element = document.getElementById('fade-root');
        if (!element) { return; }
        element.addEventListener('webkitAnimationEnd', () => {
            console.log('animation end');
            if (this.state.animationState === AnimationState.FadeOut) {
                // this.props.setCurrent(this.props.new);
                this.setState({ animationState: AnimationState.FadeIn });
            } else if (this.state.animationState === AnimationState.FadeIn) {
                this.setState({ animationState: AnimationState.Idle });
            } else {
                this.setState({ animationState: AnimationState.FadeOut });
            }
        });
    }

    public render = () => {
        console.log('render');
        if (this.state.animationState === AnimationState.FadeOut) {
            return (
                <FadeOut id="fade-root">
                    {this.props.children}
                </FadeOut>
            );
        } else if (this.state.animationState === AnimationState.FadeIn) {
            return (
                <FadeIn>
                    {this.props.children}
                </FadeIn>
            );
        } else {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        }
    }
}

export default Fader;
