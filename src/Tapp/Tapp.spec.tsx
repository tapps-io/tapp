import React from 'react';
import renderer from 'react-test-renderer';

import { Tapp } from './Tapp';

describe('[Component]: Tapp', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<Tapp name="hook" config={{}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
