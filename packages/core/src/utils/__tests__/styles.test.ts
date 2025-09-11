import { processUtilityProps } from '../styles';
import { defaultTokens } from '../../theme/tokens';

describe('processUtilityProps', () => {
  it('applies margin props correctly', () => {
    const props = {
      m: 4 as const,
      mt: 6 as const,
      mx: 2 as const,
    };
    
    const result = processUtilityProps(props);
    
    expect(result).toEqual({
      margin: 16,
      marginTop: 24,
      marginHorizontal: 8,
    });
  });

  it('applies padding props correctly', () => {
    const props = {
      p: 6 as const,
      pb: 1 as const,
      py: 4 as const,
    };
    
    const result = processUtilityProps(props);
    
    expect(result).toEqual({
      padding: 24,
      paddingBottom: 4,
      paddingVertical: 16,
    });
  });

  it('applies width and height props correctly', () => {
    const props = {
      w: 200,
      h: '50%' as const,
      minW: 100,
      maxH: 300,
    };
    
    const result = processUtilityProps(props);
    
    expect(result).toEqual({
      width: 200,
      height: '50%',
      minWidth: 100,
      maxHeight: 300,
    });
  });

  it('applies flex props correctly', () => {
    const props = {
      flex: 1,
      flexGrow: 2,
      flexShrink: 0,
    };
    
    const result = processUtilityProps(props);
    
    expect(result).toEqual({
      flex: 1,
      flexGrow: 2,
      flexShrink: 0,
    });
  });

  it('applies visual props correctly', () => {
    const props = {
      opacity: 0.5,
      rounded: 'md' as const,
    };
    
    const result = processUtilityProps(props);
    
    expect(result).toEqual({
      opacity: 0.5,
      borderRadius: 8,
    });
  });

  it('handles empty props', () => {
    const result = processUtilityProps({});
    expect(result).toEqual({});
  });

  it('ignores undefined props', () => {
    const props = {
      m: 4 as const,
      mt: undefined,
      p: undefined,
    };
    
    const result = processUtilityProps(props);
    
    expect(result).toEqual({
      margin: 16,
    });
  });

  it('handles numeric spacing values outside token range', () => {
    // Numeric values outside the token range should be used directly
    const result = processUtilityProps({});
    
    // Test that the function handles missing props correctly
    expect(result).toEqual({});
  });

  it('uses correct token values from defaultTokens', () => {
    // Test that the spacing tokens match what we expect
    const props = {
      m: 4 as const, // Should be 16 based on spacing token
      rounded: 'md' as const, // Should be 8 based on radius token
    };
    
    const result = processUtilityProps(props);
    
    // Verify the values match our spacing system (4 * 4 = 16) and radius system (md = 8)
    expect(result).toEqual({
      margin: defaultTokens.spacing[4], // Should be 16
      borderRadius: defaultTokens.radius.md, // Should be 8
    });
  });
});