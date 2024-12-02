

export const checkIsOwner = async (attributes) => {
    try {
        if (attributes) {
          console.log('Checking User Status: ')
          
          console.log('User Attributes:', attributes); // Log user attributes

          // Access custom:isOwner attribute safely
          if (attributes['custom:isOwner'] === 'true') {
            console.log('User is Owner')
            return true; // Set isOwner to true if the attribute is present and set to 'True'
          } else {
            console.log('User is CBO')
            return false; // Otherwise, set isOwner to false
          }
          
        } 
        
      } catch (error) {
        console.error('Error fetching user attributes:', error);
      } 
};
//export default checkIsOwner;