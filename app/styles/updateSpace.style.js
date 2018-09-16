import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = 198;
const slideWidth = 260;
const itemHorizontalMargin = wp(5);

export const updatesliderWidth = viewportWidth;
export const updateitemWidth = slideWidth + itemHorizontalMargin * 2 ;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: updateitemWidth,
        height: slideHeight,
        paddingHorizontal: 0,
        paddingBottom: 18, // needed for shadow
        
        
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'red',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        borderBottomRightRadius : entryBorderRadius,
        borderBottomLeftRadius: entryBorderRadius,
        borderWidth:0.3,
        borderColor:"gray"
    },
    imageContainerEven: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        borderBottomRightRadius : entryBorderRadius,
        borderBottomLeftRadius: entryBorderRadius,
        borderWidth:0.3,
        borderColor:"gray"
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        backgroundColor: 'white',
        
        
    },
    // image's border radius is buggy on ios; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 13,
        letterSpacing: 0.5,
        textAlign:"center"
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: "#999999",
        fontSize: 12,
        textAlign:"center"
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});