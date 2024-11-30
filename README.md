# Devlog Entry - [11/13/2024]

## Introducing the Team

### Tool Lead: Aiven Jerel Desiderio

This person will research alternative tools, identify good ones, and help every other team member set them up on their own machine in the best configuration for your project. This person might also establish your team’s coding style guidelines and help peers setup auto-formatting systems. This person should provide support for systems like source control and automated deployment (if appropriate to your team’s approach).

### Engine Lead: Nhat Thai

This person will research alternative engines, get buy-in from teammates on the choice, and teach peers how to use it if it is new to them. This might involve making small code examples outside of the main game project to teach others. The Engine Lead should also establish standards for which kinds of code should be organized into which folders of the project. They should try to propose software designs that insulate the rest of the team from many details of the underlying engine.

### Design Lead: Yazmyn Sims

This person will be responsible for setting the creative direction of the project, and establishing the look and feel of the game. They might make small art or code samples for others to help them contribute and maintain game content. Where the project might involve a domain-specific language, the Design Lead (who is still an engineer in this class) will lead the discussion as to what primitive elements the language needs to provide.

## Tools and Materials

### What engines, libraries, frameworks, and platforms will be used?

We plan to start with the Phaser.js v3.86.0 library in either the Node.js or Vite frameworks. The development will be handled in the Visual Studio Code IDE and the game will run in the browser so that it can easily transfer over to Mobile and PC platforms as well as various Operating System platforms. At the start, we will write the game code in TypeScript version 5.6 but later we will transition to JavaScript version ES2023 and/or Phaser.js v3.60.0.

One of our teammates is familiar with Node.js and Vite and everyone is familiar with Visual Studio Code. Phaser works best with JS and JS-like languages. Typescript being nearly identical to JavaScript is why we picked this language; we can easily switch our TypeScript code into assuming we programmed with fluidity and change in mind.

### Which tools do we expect to use in the process of authoring our project?

We expect to use generic useful version control tools such as Git and Github. Along with that the Visual Studio Code IDE to program our game in. Phaser is our other tool, and we plan on researching and looking into Phaser 3D to create a 3D interpretation for our game assignment. Within the IDE the tools lead will look into different extensions we could use and coding style practices to help format and keep our program orderly.

## Outlook

### Give us a short section on your outlook on the project. You might cover one or more of these topics:

We want to try to publish and monetize the game once we finish it rather than just throwing it into a GitHub portfolio. We also want to push the boundaries of Phaser to create a 2.5D game. Phaser is a primarily 2D engine, having said, attempting to create a 3D-like game using Phaser will be a fun challenge that we are hoping to take on.

### What do you anticipate being the hardest or riskiest part of the project?

We think that switching platforms or languages mid-way through the project could be challenging. Even though we know that the languages, platforms and frameworks we selected can work together, we don’t know how seamlessly that transition can be made until it’s time to make it. It could become a very long and tedious task. We’re also concerned about not knowing the requirements in advance. It could lead to us adding unnecessary things that we need to remove later, or not adding enough support that we now need to hurry to add. Finally, a big challenge would be pushing the boundaries of phaser. Since phaser is primarily used with 2D games, we worry about the lack of documentation or resources for this type of project.

### What are you hoping to learn by approaching the project with the tools and materials you selected above?

By using Phaser as a game library, we are hoping to create something fun and unique as well a
familiarize ourselves with the tool.

# Devlog Entry - [11/29/2024]

## How we Satisfied the Software Requirements


## Reflection
We thought a lot in advance about making this assignment as easy as possible to manipulate given the changing requirements. It's a big reason we went with JavaScript and Phaser. We implemented Tiled into the idea because it came with a built in grid system for us to just borrow from, however at first we had forgotten how to use Tiled. It took a while to get into the swing of things again but I don't think we need to change anything. 
If we were to change something I would say that the assets we used in Tiled are so pretty and detailed that I think it made us focus on things that we really didn't need to focus on immediately. For example, we have a functional walking and idle animation working which was something we didn't need for the requirements but it was something we got distracted by because it was there. I think if we were going to change something it would be our scope so that we hone in more on what's required rather than additional features.
I also think we should change up how tasks are divided. Sometimes we will pick tasks at random only to find out that one of us can't do any of our tasks right away because our task depends on someone else in the group completing their task first. We should think through how we organize our team effort a little more, but as for the environment and tools we're working with, we have gotten a lot more comfortable with them now.
