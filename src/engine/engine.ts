import * as graphicsEngine from "./graphicsEngine"
import { updateTime } from '../redux/timeSlice'
import * as dmxEngine from './dmxEngine'
import { ReduxStore } from '../redux/store'

let lastFrameTime = 0;
let engineTime = 0;
let initTime = 0;
let reduxStore: ReduxStore;

export function init(_reduxStore: ReduxStore) {
  reduxStore = _reduxStore;
  initTime = Date.now();
  graphicsEngine.init();
  dmxEngine.init();

  requestAnimationFrame(engineUpdate);
}

export function visualizerResize() {
  graphicsEngine.resize();
}

export function visualizerSetElement(domRef: any) {
  graphicsEngine.setDomElement(domRef);
}

function engineUpdate(time: number) {
  requestAnimationFrame(engineUpdate);

  const dt = time - lastFrameTime;

  if (dt < 10) return;

  // For a video game, you might limit dt so that object in-game will never move too far in a given frame
  // However, it is more important that visuals maintain sync with real time
  // if (dt > 100) dt = 1000 / 30;

  lastFrameTime = time;
  engineTime += dt;

  reduxStore.dispatch(updateTime(dt));

  graphicsEngine.update(dt);

}