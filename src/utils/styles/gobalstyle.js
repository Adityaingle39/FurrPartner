module.exports = {
  colors: {
    black: '#263238',
    white: '#FFFFFF',
    green: '#28B446',
    lightGreen: '#8ff2a4',
    orange: '#FFA500',
    lightOrange: '#e69d19',
    yellow: '#fcba03',
    lightYellow: '#f7d881',
    red: '#eb4034',
    lightRed: '#fa8c84',
    darkRed: '#961911',
    blue: '#0514A7',
    lightBlue: '#83e0fc',
    grey: '#404040',
    lightGrey: '#ababab',
    darkPrimary: '#020d75',
    primary: '#0514A7',
    lightPrimary: '#1b30f7',
    secondary: '#D7D7D5'
  },

  bgBlack: {backgroundColor: '#263238'},
  bgWhite: {backgroundColor: "#FFFFFF"},
  bgGreen: {backgroundColor: '#28B446'},
  bgBlue: {backgroundColor: '#01C4FF'},
  bgRed: {backgroundColor: '#eb4034'},

  //Main

  flexOne: {
    flex: 1
  },

  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF'
  },

  alignItemsCenter: {
    alignItems: 'center'
  },

  justifyContentCenter: {
    justifyContent: 'center'
  },

  flexDirectionRow: {
    flexDirection: 'row'
  },

  // Button style
  btn: {
    height: 45,
    // width: '100%',
    // backgroundColor: "#0514A7",
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: 20
  },

  btnSimple: {
    borderRadius: 10,
  },
  customTwinButton: { alignItems: 'center', marginHorizontal: 40, borderRadius: 10, backgroundColor: '#D9D9D9', padding: 5 },
  //Text Input Conatiner

  textInputContainer: {
    height: 45,
    width: "100%",
    alignItems: 'center',
 
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  defaultInputContainer: {
    borderWidth: 1,
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 20,
   
  },

  textInputLabel: {
    fontSize: 16,
    fontWeight: 500,
    color: '#263238'
  },
  inputText: {
    width: "100%",
    fontSize: 16
  },


  // Text
  navigatorText: {
    fontSize: 17,
    color: '#263238'
  },
  navigatorLink: {
    fontSize: 17,
  
  },


  //Headings

  heading: {
    fontSize: 20,
    fontWeight: 800,
    color: '#263238',
    textAlign: 'center'
  },
  subHeading: {
    fontSize: 15,
    
    textAlign: 'center'
  },

  pageHeading: {
    fontSize: 20,
    fontWeight: 800,
    color: '#263238',
  },


  formTextInput: {
    height: 45,
    width: "100%",
    borderWidth: 1,
  
    borderRadius: 5
  },

  searchInputView: {
    flexDirection: 'row',
    height: 45,
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
    height: 45,
  },

  spacingProperty: {
    ...Array.from({ length: 101 }, (_, i) => ({
      [`p-${i}`]: { padding: i },
      [`pt-${i}`]: { paddingTop: i },
      [`pr-${i}`]: { paddingRight: i },
      [`pb-${i}`]: { paddingBottom: i },
      [`pl-${i}`]: { paddingLeft: i },
      [`m-${i}`]: { margin: i },
      [`mt-${i}`]: { marginTop: i },
      [`mr-${i}`]: { marginRight: i },
      [`mb-${i}`]: { marginBottom: i },
      [`ml-${i}`]: { marginLeft: i },
      [`fs-${i}`]: { fontSize: i },
    })).reduce((a, b) => ({ ...a, ...b }), {}),

  },
  scrollView: {
    // flex: 1,
    // backgroundColor: 'pink',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
}