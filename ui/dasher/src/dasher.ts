import { PingCtrl, ctrl as pingCtrl } from './ping'
import { LangsCtrl, ctrl as langsCtrl } from './langs'
import { SoundCtrl, ctrl as soundCtrl } from './sound'
import { BackgroundCtrl, BackgroundData, ctrl as backgroundCtrl } from './background'
import { BoardCtrl, BoardData, ctrl as boardCtrl } from './board'
import { ThemeCtrl, ThemeData, ctrl as themeCtrl } from './theme'
import { PieceCtrl, PieceData, ctrl as pieceCtrl } from './piece'
import { Redraw, Prop, prop } from './util'
import { get } from './xhr'

export interface DasherData {
  user: LightUser
  lang: {
    current: string
    accepted: string[]
  }
  sound: {
    list: string[]
  }
  background: BackgroundData
  board: BoardData
  theme: ThemeData
  piece: PieceData
  kid: boolean
  coach: boolean
  prefs: any
  i18n: any
}

export type Mode = 'links' | 'langs' | 'sound' | 'background' | 'board' | 'theme' | 'piece'

  export interface DasherCtrl {
    mode: Prop<Mode>
    setMode: (m: Mode) => void
    data: DasherData
    trans: Trans
    ping: PingCtrl
    subs: {
      langs: LangsCtrl
      sound: SoundCtrl
      background: BackgroundCtrl,
      board: BoardCtrl,
      theme: ThemeCtrl,
      piece: PieceCtrl
    }
    opts: DasherOpts
  }

  export interface DasherOpts {
    playing: boolean
  }

  export function makeCtrl(opts: DasherOpts, data: DasherData, redraw: Redraw): DasherCtrl {

    const trans = window.lichess.trans(data.i18n);

    let mode: Prop<Mode> = prop('links' as Mode);

    function setMode(m: Mode) {
      mode(m);
      redraw();
    }
    function close() { setMode('links'); }

    const ping = pingCtrl(trans, redraw);

    const subs = {
      langs: langsCtrl(data.lang, redraw, close),
      sound: soundCtrl(data.sound.list, trans, redraw, close),
      background: backgroundCtrl(data.background, redraw, close),
      board: boardCtrl(data.board, redraw, close),
      theme: themeCtrl(data.theme, () => data.board.is3d ? 'd3' : 'd2', redraw, setMode),
      piece: pieceCtrl(data.piece, () => data.board.is3d ? 'd3' : 'd2', redraw, setMode)
    };

    return {
      mode,
      setMode,
      data,
      trans,
      ping,
      subs,
      opts
    };
  };