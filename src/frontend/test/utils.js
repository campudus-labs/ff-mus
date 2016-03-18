import ReactTestUtils from 'react-addons-test-utils';

export function shallowRender(component, context, depth) {
  const renderer = ReactTestUtils.createRenderer();
  renderer.render(component, context);
  const result = renderer.getRenderOutput();
  if (depth > 1) {
    return shallowRender(result, context, depth - 1);
  } else {
    return result;
  }
}
