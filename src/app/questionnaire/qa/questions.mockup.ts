export class QuestionsMockup {
  public static express = [
    {
      title: 'What is your vision?',
      type: 'text',
    },
    {
      title: 'What is strictly unique that others are not offering? (can be improvement of existing thing)',
      type: 'text',
      options: {
        multiLine: true
      }
    },
    {
      title: 'Why will you succeed?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'What specifically makes you better?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'What is the product description?',
      subtitle: '',
      type: 'text'
    }
  ];

  public static develop = [
    {
      title: 'What key features does my product or service have that others will have a hard time copying',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'Have you done a SWOFT anylysis?',
      subtitle: 'of idea to competitors',
      type: 'radio',
      values : [
        'Yes',
        'No'
      ]
    },
    {
      title: 'Who can you name that would benefit from your product or service?',
      subtitle: 'can be you',
      type: 'text',
    },
    {
      title: 'What is the size of the market that will buy your product or service?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'Have you reached out to potential customers for feedback?',
      subtitle: '',
      type: 'radio',
      values: [
        'Yes',
        'No'
      ]
    }
  ];

  public static visual = [
    {
      title: 'Can you set up a landing page and encourage interested people to sign up for more information?',
      subtitle: '',
      type: 'radio',
      values: [
        'Yes',
        'No'
      ]
    },
    {
      title: 'What would it take for you to make a proof of concept or demo or beta of your product?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'Can you produce the actual product yourself or do you have a partner who can?',
      subtitle: '',
      type: 'radio',
      values: [
        'I can produce the product myself',
        'I have a partner who can produce the product'
      ]
    }
  ];

  public static target = [
    {
      title: 'How many other people are in the market?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'How mature is the market?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'How will the market evolve over the next 10years?',
      subtitle: '',
      type: 'radio',
      values: [
        'It is growing',
        'It is slowing',
        'Not sure'
      ]
    },
    {
      title: 'What are the startup costs?',
      subtitle: '',
      type: 'text'
    },
    {
      title: 'What are the barriers to entry for you?',
      subtitle: '',
      type: 'text',
    },
    {
      title: 'Do you have any barriers to entry for your competitions?',
      subtitle: '',
      type: 'text',
    }
  ];

  public static plan = [
    {
      title: 'Amount of capital invested so far?',
      subtitle: '',
      type: 'text',
    },
    {
      title: 'What are the milestones you need to reach your vision?',
      subtitle: '',
      type: 'text',
      options: {
        multiLine: true
      }
    },
    {
      title: 'What are the goals relevant to this milestone?',
      subtitle: '',
      type: 'text',
      options: {
        multiLine: true
      }
    },
    {
      title: 'What are the processes involved in this goal?',
      subtitle: '',
      type: 'text',
      options: {
        multiLine: true
      }
    }
  ];
}
