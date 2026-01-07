import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img 
            src="/cars.png" 
            alt="Car Logo"
            style={{ width: props.width, height: props.height }}
            className={props.className}
        />
    );
}