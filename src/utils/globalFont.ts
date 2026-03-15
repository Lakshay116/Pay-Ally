// import { Text, TextInput } from 'react-native';

// export default function setGlobalFont() {
//     const TextRender = Text.render;
//     const TextInputRender = TextInput.render;

//     Text.render = function (...args) {
//         const origin = TextRender.call(this, ...args);
//         return {
//             ...origin,
//             props: {
//                 ...origin.props,
//                 style: [
//                     { fontFamily: 'Sansation-Regular' },
//                     origin.props.style,
//                 ],
//             },
//         };
//     };

//     TextInput.render = function (...args) {
//         const origin = TextInputRender.call(this, ...args);
//         return {
//             ...origin,
//             props: {
//                 ...origin.props,
//                 style: [
//                     { fontFamily: 'Sansation-Regular' },
//                     origin.props.style,
//                 ],
//             },
//         };
//     };
// }

import { Text, TextInput, TextStyle } from 'react-native';

export default function setGlobalFont(): void {
    const TextRender = (Text as any).render;
    const TextInputRender = (TextInput as any).render;

    (Text as any).render = function (...args: any[]) {
        const origin = TextRender.call(this, ...args);

        return {
            ...origin,
            props: {
                ...origin.props,
                style: [
                    { fontFamily: 'Sansation-Regular' } as TextStyle,
                    origin.props?.style,
                ],
            },
        };
    };

    (TextInput as any).render = function (...args: any[]) {
        const origin = TextInputRender.call(this, ...args);

        return {
            ...origin,
            props: {
                ...origin.props,
                style: [
                    { fontFamily: 'Sansation-Regular' } as TextStyle,
                    origin.props?.style,
                ],
            },
        };
    };
}