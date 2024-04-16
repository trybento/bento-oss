import useMainStore from './useMainStore';

export default function useDispatch() {
  return useMainStore((state) => state.dispatch);
}
