type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ILoadingState {
  loading: LoadingStatus;
}
