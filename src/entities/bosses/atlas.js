import Boss from '../boss';
import AtlasSegments from './atlas/segments';

export default class Atlas extends Boss {
    constructor (scene, x, y) {
       super(scene, x, y);
    }

    segmentsClass () { return AtlasSegments; }
}