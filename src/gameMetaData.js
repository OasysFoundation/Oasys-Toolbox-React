import polyphonicThumb from "./play_images/polyphonic.png"
import soundManThumb from "./play_images/soundman.png"
import forceAndMotionThumb from "./play_images/forceAndMotion.png"

const gameMetaData = [
    {
        name: "polyphonic",
        url: "https://dacapo.io/polyphonic-pitch-detector/",
        primaryText: 'See Your Voice',
        description: "See your Pitch inside a Realtime Spectrogram",
        thumbnail: polyphonicThumb
    },
	{
        name: "Forces and Motion Basics",
        url: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
        primaryText: 'Forces and Motion Basics',
        description: "Explore the forces at work when pulling against a cart, and pushing a " +
		"refrigerator, crate, or person. Create an applied force and see how it makes objects move. " +
		"Change friction and see how it affects the motion of objects.",
        thumbnail: forceAndMotionThumb
    },
    {
        name:"soundman",
    	url: "https://dacapo.io/soundman/",
        primaryText: 'Play Soundman with Your Voice',
        description: "Use your voice to catch flies and defeat Goblins",
        thumbnail: soundManThumb
    },
];

export default gameMetaData;