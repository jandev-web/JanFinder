export const updatePackage = async (packageInfo) => {
  const apiKey = process.env.NEXT_PUBLIC_UPDATE_PACKAGE_CHOICE_KEY;
  const url = process.env.NEXT_PUBLIC_UPDATE_PACKAGE_CHOICE_URL;

  if (!apiKey || !url) {
      console.error('API key or URL is missing in environment variables');
      throw new Error('API key or URL is not configured. Please check environment variables.');
  }

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(packageInfo)
      });

      if (!response.ok) {
          const errorDetails = await response.json();
          console.error(`Failed to update package: ${errorDetails.message}`);
          return {
              success: false,
              message: `Failed to update package: ${errorDetails.message}`
          };
      }

      const data = await response.json();
      return {
          success: true,
          data
      };
  } catch (error) {
      console.error('Unexpected error updating package:', error);
      return {
          success: false,
          message: 'An unexpected error occurred. Please try again later.'
      };
  }
};
