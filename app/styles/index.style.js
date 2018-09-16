import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#A9A9A9',
    background2: '#21D4FD'
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1,
        paddingTop: 10,
        paddingBottom:0
    },
    scrollviewContentContainer: {
        paddingBottom: 0
    },
    scrollContainer: {
        marginBottom: 0,
    },
    title: {
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center'
    },
    subtitle: {
        marginTop: 0,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 0
    },
    sliderContentContainer: {
    },
    paginationContainer: {
        paddingVertical: 0
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    }
});