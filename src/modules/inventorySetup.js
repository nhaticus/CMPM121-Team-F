    

    let inventory = [];

    function inventorySetup(thisscene){
        const inventorybutton = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 150,
            y: 280,
          });
          inventorybutton.on("pointerdown", thisscene.onPressed, thisscene);
      
          inventory.push(inventorybutton);

        const inventorybutton2 = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 182,
            y: 280,
        });

        inventorybutton.on("pointerdown", thisscene.onPressed, thisscene);
        inventory.push(inventorybutton2);

        const inventorybutton3 = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 214,
            y: 280,
          });
          inventorybutton3.on("pointerdown", thisscene.onPressed, thisscene);
      
          inventory.push(inventorybutton3);

          const inventorybutton4 = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 246,
            y: 280,
          });
          inventorybutton4.on("pointerdown", thisscene.onPressed, thisscene);
      
          inventory.push(inventorybutton4);
      
          const inventorybutton5 = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 278,
            y: 280,
          });
          inventorybutton5.on("pointerdown", thisscene.onPressed, thisscene);
      
          inventory.push(inventorybutton5);
      
          const inventorybutton6 = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 310,
            y: 280,
          });
          inventorybutton6.on("pointerdown", thisscene.onPressed, thisscene);
      
          inventory.push(inventorybutton6);
      
          const inventorybutton7 = new Inventory({
            scene: thisscene,
            key: "inventory",
            up: 0,
            down: 1,
            over: 1,
            x: 342,
            y: 280,
          });
          inventorybutton7.on("pointerdown", thisscene.onPressed, thisscene);
      
          inventory.push(inventorybutton7);

    }
    /* inventory */
