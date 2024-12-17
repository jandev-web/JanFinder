// app/login/page.tsx - Custom <Authenticator>

"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Authenticator, useAuthenticator, View, Heading, Text, useTheme, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsExports from '@/aws-exports';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { sessionStorage } from 'aws-amplify/utils';
import { signOut } from "aws-amplify/auth";


//cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

const customTheme: Theme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          '10': '#e3fcec', // Light green for backgrounds
          '80': '#4caf50', // Primary green
          '100': '#388e3c', // Darker green for emphasis
        },
        secondary: {
          '10': '#fff9e6', // Light yellow for backgrounds
          '80': '#ffeb3b', // Bright yellow for actions like buttons
          '100': '#fbc02d', // Darker yellow for emphasis
        },
      },
    },
    components: {
      // Customize the SignIn components, buttons, inputs, etc.
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.80}',
          _hover: {
            backgroundColor: '{colors.brand.secondary.80}',
          },
        },
      },
      input: {
        borderColor: '{colors.brand.primary.100}',
        _focus: {
          borderColor: '{colors.brand.secondary.100}',
        },
      },
    },
  },
};

const components = {
  Header() {
    //const { tokens } = useTheme();

    return (
      <div className="relative">
        {/* Add any custom header content if needed */}
      </div>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>
          &copy; JanFind All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Sign in to your Member account
        </Heading>
      );
    },
  },
};


function CustomAuthenticator() {
  const { user } = useAuthenticator((context) => [context.user]);

  console.log(user)
  useEffect(() => {
    if (user) {
      console.log('Is User')
      //signOut();
      redirect("/members/home");
    }
  }, [user]);

  return (
    <ThemeProvider theme={customTheme}>
      <Authenticator components={components} />
    </ThemeProvider>
  )
}

export default function Login() {
  return (
    <Authenticator.Provider>
      <CustomAuthenticator />
    </Authenticator.Provider>
  );
}