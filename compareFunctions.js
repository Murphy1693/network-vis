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
  console.log("PRIMARY", primary);
  primary.matches = primary.matches || [];
  let primary_total_count = 0;
  let selected_total_count = 0;
  let shared_count = 0;
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
      colors.push({
        locus: a.locus,
        genotype: newStr,
      });
    }
  );
  primary.total = primary_total_count;
  primary.matches.push(shared_count);
  return {
    id: selectedNode.id,
    observed_genotype_color: paginateArray(colors),
    shared: shared_count,
    total: selected_total_count,
  };
};

export const createColorAndCount = (activeNode, selectedNode) => {
  let newActiveNode = { ...activeNode };
  let newSelectedNode;
  let primary_total_count = 0;
  let selected_total_count = 0;
  let shared_count = 0;
  newActiveNode.matches = newActiveNode.matches || [];
  let observed_genotype_display = [];
  let latent_genotype_display = [];
  if (activeNode && selectedNode) {
    newSelectedNode = { ...selectedNode };
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
        observed_genotype_display.push(newStr);
      }
    );
    newActiveNode.observed_genotype_display = paginateArray(
      newActiveNode.observed_genotype
    );
    newActiveNode.total = primary_total_count;
    newActiveNode.matches.push(shared_count);
    newSelectedNode.observed_genotype_display = paginateArray(
      observed_genotype_display
    );
    newSelectedNode.total = selected_total_count;
    newSelectedNode.shared_count = shared_count;
    return [newActiveNode, newSelectedNode];
  } else if (activeNode && !selectedNode) {
    newActiveNode.observed_genotype.forEach((allele_str) => {
      for (let i = 0; i < allele_str.length; i++) {
        if (allele_str[i] === "1") {
          primary_total_count++;
        }
      }
    });
    newActiveNode.total = primary_total_count;
    newActiveNode.observed_genotype_display = paginateArray(
      newActiveNode.observed_genotype
    );
    return newActiveNode;
  }
};

export const compareWithActive = (activeNode, selectedNode) => {
  let newActiveNode = { ...activeNode };
  let newSelectedNode = { ...selectedNode };
};

export const compareWithoutActive = (node) => {};
