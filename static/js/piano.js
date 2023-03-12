import { refreshChart } from "./chart.js";
import { AudioSynth } from "./synth.js";

const URL = "http://localhost:8888/static/model/";

let model, maxPredictions, webcam;

const app = Vue.createApp({
    data() {
        return {
            isClicked: [],
            classLabels: null,
            highestClass: 0,
            confs: null,
            synth: null
        }
    },
    created() {
        this.init();
    },

    methods: {
        click(keyId) {
            this.isClicked[keyId] = true;
            setTimeout(() => {
                this.isClicked[keyId] = false;
            }, 501);
            
            let note = null;
            switch(keyId) {
                case 8:
                    note = "C";
                    break;
                case 9:
                    note = "D";
                    break;
                case 10:
                    note = "E";
                    break;
                case 11:
                    note = "F";
                    break;
                case 12:
                    note = "G";
                    break;
                default:
                    note = "C";
                    break;
            }

            let src = this.synth.generate("0", note, 3, 0.5);
            let container = new Audio(src);
            container.addEventListener('ended', function() { container = null; });
            container.addEventListener('loadeddata', function(e) { e.target.play(); });
            container.autoplay = false;
            container.setAttribute('type', 'audio/wav');
            container.load();
        },

        async predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            this.confs = [];
            let tmp = 0;
            for(let i = 0; i < prediction.length; i++) {
                this.confs.push(prediction[i].probability.toFixed(2));
                if(prediction[i].probability > prediction[tmp].probability) {
                    tmp = i;
                }
            }
            if(this.highestClass != tmp) {
                this.highestClass = tmp;
                if(this.highestClass != 0)
                    this.click(this.highestClass + 7);
            }
        },

        async loop() {
            webcam.update(); // update the webcam frame
            await this.predict();
            window.requestAnimationFrame(this.loop);
            refreshChart(this.confs);
        },

        async init() {
            // init synthesizer
            this.synth = new AudioSynth();
            this.synth.setVolume(0.5);

            
            // init model
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Convenience function to setup a webcam
            const flip = false; // whether to flip the webcam
            webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
            window.requestAnimationFrame(this.loop);
        }
    }
})

app.mount('.keyboard')

export { app }