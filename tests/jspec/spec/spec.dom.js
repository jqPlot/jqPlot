
describe 'DOM Sandbox'

  before_each
    dom = defaultSandbox() // sandbox() is overridden by jQuery
  end
  
  it 'should allow creation of sandboxes'
    dom.toString().should_include 'HTMLDivElement'
  end
  
end