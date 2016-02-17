import <%= moduleSafeName %> from '..src/<%= moduleName %>.js';

describe('<%= moduleSafeName %>', () => {
  it('should be runing without any problems', () => {
    expect(<%= moduleSafeName %>).to.not.throw();
  });
});
