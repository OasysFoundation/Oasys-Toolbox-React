import React, {Component} from 'react';

import libmoji from 'libmoji'

class Bitmoji extends Component {


    render() {

        let gender = libmoji.genders[libmoji.randInt(2)];
        let style = libmoji.styles[libmoji.randInt(3)];
        let traits = libmoji.randTraits(libmoji.getTraits(gender[0],style[0]));
        let outfit = libmoji.randOutfit(libmoji.getOutfits(libmoji.randBrand(libmoji.getBrands(gender[0]))));

        return (
            <div>
                <img src={libmoji.buildPreviewUrl("fashion",3,gender[1],style[1],0,traits,outfit)} />        	
            </div>
        );
    }
}


export default Bitmoji;
