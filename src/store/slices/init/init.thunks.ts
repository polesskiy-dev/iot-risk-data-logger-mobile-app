import { listenerMiddleware } from '../../store';
import { signIn } from '../auth/auth.slice';
import nfcService from '../../../services/nfc/nfc.service';

// TODO
listenerMiddleware.startListening({
  actionCreator: signIn.fulfilled,
  effect: async () => {
    console.log('signIn.fulfilled, nfcService.init()')
    await nfcService.init();
  },
});
