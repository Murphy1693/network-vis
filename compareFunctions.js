let zip = function (arr1, arr2, callback) {
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    callback(arr1[i], arr2[i]);
  }
};

export const paginateArray = function (arr) {
  let newArr = [];
  let prev = 0;
  for (let i = 20; i <= arr.length; i += 20) {
    newArr.push(arr.slice(prev, i));
    prev = i;
  }
  if (arr[prev - 1] !== arr[arr.length - 1]) {
    console.log("triggered");
    console.log(arr[prev - 1], arr[arr.length - 1]);
    newArr.push(arr.slice(prev, arr.length));
  }
  return newArr;
};

export const compareObserved = function (activeNode, selectedNode, primary) {
  let colors = [];
  let colors2 = [];
  console.log("PRIMARY", primary);
  primary.matches = primary.matches || [];
  let latent_primary_total_count = 0;
  let latent_selected_total_count = 0;
  let latent_shared_count = 0;
  primary.latent_matches = primary.latent_matches || [];
  let primary_total_count = 0;
  let selected_total_count = 0;
  let shared_count = 0;
  zip(
    activeNode.flat_latent_genotype,
    selectedNode.flat_latent_genotype,
    (a, b) => {
      let newStr = "";
      zip(a.genotype, b.genotype, function (c, d) {
        if (c === d && c === "1") {
          latent_shared_count++;
          latent_primary_total_count++;
          latent_selected_total_count++;
          // solid red
          newStr += "2";
        } else if (c === d && c === "0") {
          // solid white
          newStr += "0";
        } else if (c !== d) {
          if (d === "1") {
            selected_total_count++;
            // solid selected color
            newStr += "1";
          } else if (d === "0") {
            primary_total_count++;
            // border red
            newStr += "3";
          }
        }
      });
      colors2.push({
        locus: a.locus,
        genotype: newStr,
      });
    }
  );
  primary.latent_total = latent_primary_total_count;
  primary.latent_matches.push(latent_shared_count);

  zip(activeNode.observed_genotype, selectedNode.observed_genotype, (a, b) => {
    let newStr = "";
    zip(a.genotype, b.genotype, function (c, d) {
      if (c === d && c === "1") {
        shared_count++;
        primary_total_count++;
        selected_total_count++;
        // solid red
        newStr += "2";
      } else if (c === d && c === "0") {
        // solid white
        newStr += "0";
      } else if (c !== d) {
        if (d === "1") {
          selected_total_count++;
          // solid selected color
          newStr += "1";
        } else if (d === "0") {
          primary_total_count++;
          // border red
          newStr += "3";
        }
      }
    });
    colors.push({
      locus: a.locus,
      genotype: newStr,
    });
  });
  primary.total = primary_total_count;
  primary.matches.push(shared_count);

  return {
    id: selectedNode.id,
    observed_genotype_color: paginateArray(colors),
    latent_genotype_color: paginateArray(colors2),
    shared: shared_count,
    total: selected_total_count,
  };
};

export const createColorAndCount = (activeNode, selectedNode) => {
  let newActiveNode = { ...activeNode };
  let newSelectedNode;
  let primary_total_count = 0;
  let latent_primary_total_count = 0;
  let selected_total_count = 0;
  let latent_selected_total_count = 0;
  let shared_count = 0;
  let latent_shared_count = 0;
  let observed_genotype_display = [];
  let latent_genotype_display = [];
  if (activeNode && selectedNode) {
    newSelectedNode = { ...selectedNode };
    zip(
      activeNode.flat_latent_genotype,
      selectedNode.flat_latent_genotype,
      (a, b) => {
        let newStr = "";
        zip(a.genotype, b.genotype, function (c, d) {
          if (c === d && c === "1") {
            latent_shared_count++;
            latent_primary_total_count++;
            latent_selected_total_count++;
            // solid red
            newStr += "2";
          } else if (c === d && c === "0") {
            // solid white
            newStr += "0";
          } else if (c !== d) {
            if (d === "1") {
              latent_selected_total_count++;
              // solid selected color
              newStr += "1";
            } else if (d === "0") {
              latent_primary_total_count++;
              // border red
              newStr += "3";
            }
          }
        });
        latent_genotype_display.push({ genotype: newStr });
      }
    );
    // primary.latent_total = latent_primary_total_count;
    // primary.latent_matches.push(latent_shared_count);
    zip(
      activeNode.observed_genotype,
      selectedNode.observed_genotype,
      function (a, b) {
        let newStr = "";
        zip(a.genotype, b.genotype, function (c, d) {
          if (c === d && c === "1") {
            shared_count++;
            primary_total_count++;
            selected_total_count++;
            // solid red
            newStr += "2";
          } else if (c === d && c === "0") {
            // solid white
            newStr += "0";
          } else if (c !== d) {
            if (d === "1") {
              selected_total_count++;
              // solid selected color
              newStr += "1";
            } else if (d === "0") {
              primary_total_count++;
              // border red
              newStr += "3";
            }
          }
        });
        observed_genotype_display.push({ genotype: newStr });
      }
    );
    newActiveNode.observed_genotype_display = paginateArray(
      newActiveNode.observed_genotype
    );
    newActiveNode.latent_genotype_display = paginateArray(
      newActiveNode.flat_latent_genotype
    );
    newActiveNode.total = primary_total_count;
    newActiveNode.latent_total = latent_primary_total_count;

    newSelectedNode.observed_genotype_display = paginateArray(
      observed_genotype_display
    );
    newSelectedNode.latent_genotype_display = paginateArray(
      latent_genotype_display
    );
    newSelectedNode.total = selected_total_count;
    newSelectedNode.latent_total = latent_selected_total_count;

    newSelectedNode.shared_count = shared_count;
    newSelectedNode.latent_shared_count = latent_shared_count;
    console.log(newActiveNode, newSelectedNode);
    return [newActiveNode, newSelectedNode];
  } else if (activeNode && !selectedNode) {
    newActiveNode.observed_genotype.forEach((geno_obj) => {
      for (let i = 0; i < geno_obj.genotype.length; i++) {
        if (geno_obj.genotype[i] === "1") {
          primary_total_count++;
        }
      }
    });
    newActiveNode.flat_latent_genotype.forEach((geno_obj) => {
      for (let i = 0; i < geno_obj.genotype.length; i++) {
        if (geno_obj.genotype[i] === "1") {
          latent_primary_total_count++;
        }
      }
    });
    newActiveNode.latent_total = latent_primary_total_count++;
    newActiveNode.total = primary_total_count;
    newActiveNode.observed_genotype_display = paginateArray(
      newActiveNode.observed_genotype
    );
    newActiveNode.latent_genotype_display = paginateArray(
      newActiveNode.flat_latent_genotype
    );
    return newActiveNode;
  }
};

export const compareWithActive = (activeNode, selectedNode) => {
  let newActiveNode = { ...activeNode };
  let newSelectedNode = { ...selectedNode };
};

export const compareWithoutActive = (node) => {};
