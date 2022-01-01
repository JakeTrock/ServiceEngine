// ------------------------------------------------------------------ //
// Chunk Expression Library for JavaScript                            //
// (c) 2006 Jonathynne/Ginny Rebecca Bettencourt / Kreative Software  //
// http://www.kreativekorp.com                                        //
//                                                                    //
// You may do anything you wish with this code, provided the above    //
// copyright notice remains intact. Please indicate any changes made. //
// ------------------------------------------------------------------ //

//improved by Jacob Trock https://cleanconnect.us

//CHANGES: removed tests, reformtted docs, changed structure to json-like for proper module handling,
// made some vars consts, made some functions easier to understand

const init = () => {
  let cxl_mid = parseInt("0x7FFFFFFF", 16); //middle, rounding up (HyperCard's middle)
  let cxl_mdd = parseInt("0x80000000", 16); //middle, rounding down
  let cxl_any = parseInt("0x80000001", 16); //any, randomly chosen; must call cxl_randomize() before using

  let cxl_item_delimiter = ",";
  let cxl_list_delimiter = "\b";
  let cxl_element_delimiter = "\x7F";
  let cxl_random = Math.random();
  // --------------------------- //
  // Private Functions - General //
  // --------------------------- //

  function cxl_astart(chunk, start, count) {
    var a =
      chunk == "byte" ||
      chunk == "bytes" ||
      chunk == "short" ||
      chunk == "shorts" ||
      chunk == "long" ||
      chunk == "longs"
        ? 0
        : 1;

    if (start == cxl_mid) return Math.ceil((count - 1) / 2) + a;
    else if (start == cxl_mdd) return Math.floor((count - 1) / 2) + a;
    else if (start == cxl_any) return Math.floor(cxl_random * count) + a;
    else if (start < 0) return count + start + a;
    else return start;
  }

  function cxl_aend(chunk, start, end, count) {
    var a =
      chunk == "byte" ||
      chunk == "bytes" ||
      chunk == "short" ||
      chunk == "shorts" ||
      chunk == "long" ||
      chunk == "longs"
        ? 0
        : 1;

    if (end == cxl_mid) return Math.max(Math.ceil((count - 1) / 2) + a, start);
    else if (end == cxl_mdd)
      return Math.max(Math.floor((count - 1) / 2) + a, start);
    else if (end == cxl_any)
      return Math.max(Math.floor(cxl_random * count) + a, start);
    else if (end < 0) return Math.max(count + end + a, start);
    else return Math.max(Math.min(count + a - 1, end), start);
  }

  function cxl_isbreak(c) {
    return c == "\n" || c == "\r";
  }

  function cxl_iswhite(c) {
    return c == "\n" || c == "\r" || c == "\t" || c == " ";
  }

  function cxl_issentender(c) {
    return c == "." || c == "!" || c == "?";
  }

  function cxl_makeplural(s) {
    if (s.substring(s.length - 1, s.length) != "s") return s + "s";
    return s;
  }

  function cxl_makesingular(s) {
    if (s.substring(s.length - 1, s.length) == "s")
      return s.substring(0, s.length - 1);
    return s;
  }

  // ------------------------------ //
  // Private Functions - Paragraphs //
  // ------------------------------ //

  function cxl_paragraph_count(text) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_isbreak(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      while (s < text.length && !cxl_isbreak(text.charAt(s))) s++;
      while (s < text.length && cxl_isbreak(text.charAt(s))) s++;
    }
    return n;
  }

  function cxl_paragraph_start(text, num) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_isbreak(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      if (n == num) return s;
      while (s < text.length && !cxl_isbreak(text.charAt(s))) s++;
      while (s < text.length && cxl_isbreak(text.charAt(s))) s++;
    }
    return num <= 0 ? 0 : text.length;
  }

  function cxl_paragraph_end(text, num) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_isbreak(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      while (s < text.length && !cxl_isbreak(text.charAt(s))) s++;
      if (n == num) return s;
      while (s < text.length && cxl_isbreak(text.charAt(s))) s++;
    }
    return num <= 0 ? 0 : text.length;
  }

  // ----------------------------- //
  // Private Functions - Sentences //
  // ----------------------------- //

  function cxl_sentence_count(text) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      while (s < text.length && !cxl_issentender(text.charAt(s))) s++;
      while (s < text.length && !cxl_iswhite(text.charAt(s))) s++;
      while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    }
    return n;
  }

  function cxl_sentence_start(text, num) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      if (n == num) return s;
      while (s < text.length && !cxl_issentender(text.charAt(s))) s++;
      while (s < text.length && !cxl_iswhite(text.charAt(s))) s++;
      while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    }
    return num <= 0 ? 0 : text.length;
  }

  function cxl_sentence_end(text, num) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      while (s < text.length && !cxl_issentender(text.charAt(s))) s++;
      while (s < text.length && !cxl_iswhite(text.charAt(s))) s++;
      if (n == num) return s;
      while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    }
    return num <= 0 ? 0 : text.length;
  }

  // ------------------------- //
  // Private Functions - Words //
  // ------------------------- //

  function cxl_word_count(text) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      while (s < text.length && !cxl_iswhite(text.charAt(s))) s++;
      while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    }
    return n;
  }

  function cxl_word_start(text, num) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      if (n == num) return s;
      while (s < text.length && !cxl_iswhite(text.charAt(s))) s++;
      while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    }
    return num <= 0 ? 0 : text.length;
  }

  function cxl_word_end(text, num) {
    var n, s;
    n = 0;
    s = 0;
    while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    while (s < text.length) {
      n++;
      while (s < text.length && !cxl_iswhite(text.charAt(s))) s++;
      if (n == num) return s;
      while (s < text.length && cxl_iswhite(text.charAt(s))) s++;
    }
    return num <= 0 ? 0 : text.length;
  }

  return {
    // ----------------- //
    // Oddball Functions //
    // ----------------- //

    // must be called before any operation using cxl_any //
    cxl_randomize: () => {
      cxl_random = Math.random();
    },

    cxl_save_delimiters: () => {
      var a = new Array(0);
      a[0] = cxl_item_delimiter;
      a[1] = cxl_list_delimiter;
      a[2] = cxl_element_delimiter;
      return a;
    },

    cxl_restore_delimiters: (a) => {
      cxl_item_delimiter = a[0];
      cxl_list_delimiter = a[1];
      cxl_element_delimiter = a[2];
    },

    cxl_reset_delimiters: () => {
      cxl_item_delimiter = ",";
      cxl_list_delimiter = "\b";
      cxl_element_delimiter = "\x7F";
    },
    // ---------------------------------- //
    // Primitives - Count, Start, and End //
    // ---------------------------------- //

    cxl_chunk_count: (text, chunk) => {
      switch (chunk.toLowerCase()) {
        case "char":
        case "chars":
        case "character":
        case "characters":
          return text.length;
          break;

        case "word":
        case "words":
          return cxl_word_count(text);
          break;

        case "item":
        case "items":
          if (text.length == 0) return 0;
          return text.split(cxl_item_delimiter).length;
          break;

        case "list":
        case "lists":
          if (text.length == 0) return 0;
          return text.split(cxl_list_delimiter).length;
          break;

        case "elem":
        case "elems":
        case "element":
        case "elements":
          if (text.length == 0) return 0;
          return text.split(cxl_element_delimiter).length;
          break;

        case "line":
        case "lines":
          if (text.length == 0) return 0;
          return text.split("\n").length;
          break;

        case "para":
        case "paras":
        case "paragraph":
        case "paragraphs":
          return cxl_paragraph_count(text);
          break;

        case "sent":
        case "sents":
        case "sentence":
        case "sentences":
          return cxl_sentence_count(text);
          break;

        case "byte":
        case "bytes":
          return text.length;
          break;

        case "short":
        case "shorts":
          return Math.ceil(text.length / 2);
          break;

        case "long":
        case "longs":
          return Math.ceil(text.length / 4);
          break;

        default:
          return 0;
          break;
      }
    },

    cxl_chunk_start: (text, chunk, start) => {
      var count = this.cxl_chunk_count(text, chunk);
      var st = cxl_astart(chunk, start, count);
      var cc, co;
      switch (chunk.toLowerCase()) {
        case "char":
        case "chars":
        case "character":
        case "characters":
          return st - 1;
          break;

        case "word":
        case "words":
          return cxl_word_start(text, st);
          break;

        case "item":
        case "items":
          if (st < 1) return 0;
          cc = 1;
          co = 0;
          while (1) {
            if (cc >= st) return co;
            cc++;
            co =
              text.indexOf(cxl_item_delimiter, co) + cxl_item_delimiter.length;
            if (co < cxl_item_delimiter.length) return text.length;
          }
          break;

        case "list":
        case "lists":
          if (st < 1) return 0;
          cc = 1;
          co = 0;
          while (1) {
            if (cc >= st) return co;
            cc++;
            co =
              text.indexOf(cxl_list_delimiter, co) + cxl_list_delimiter.length;
            if (co < cxl_list_delimiter.length) return text.length;
          }
          break;

        case "elem":
        case "elems":
        case "element":
        case "elements":
          if (st < 1) return 0;
          cc = 1;
          co = 0;
          while (1) {
            if (cc >= st) return co;
            cc++;
            co =
              text.indexOf(cxl_element_delimiter, co) +
              cxl_element_delimiter.length;
            if (co < cxl_element_delimiter.length) return text.length;
          }
          break;

        case "line":
        case "lines":
          if (st < 1) return 0;
          cc = 1;
          co = 0;
          while (1) {
            if (cc >= st) return co;
            cc++;
            co = text.indexOf("\n", co) + 1;
            if (co < 1) return text.length;
          }
          break;

        case "para":
        case "paras":
        case "paragraph":
        case "paragraphs":
          return cxl_paragraph_start(text, st);
          break;

        case "sent":
        case "sents":
        case "sentence":
        case "sentences":
          return cxl_sentence_start(text, st);
          break;

        case "byte":
        case "bytes":
          return st;
          break;

        case "short":
        case "shorts":
          return st * 2;
          break;

        case "long":
        case "longs":
          return st * 4;
          break;

        default:
          return 0;
          break;
      }
    },

    cxl_chunk_end: (text, chunk, start, end) => {
      var count = this.cxl_chunk_count(text, chunk);
      var st = cxl_astart(chunk, start, count);
      var en = cxl_aend(chunk, st, end, count);
      var cc, co;
      switch (chunk.toLowerCase()) {
        case "char":
        case "chars":
        case "character":
        case "characters":
          return en;
          break;

        case "word":
        case "words":
          return cxl_word_end(text, en);
          break;

        case "item":
        case "items":
          if (en < 1) return 0;
          cc = 0;
          co = 0;
          while (1) {
            cc++;
            co = text.indexOf(cxl_item_delimiter, co);
            if (co < 0) return text.length;
            if (cc >= en) return co;
            co += cxl_item_delimiter.length;
          }
          break;

        case "list":
        case "lists":
          if (en < 1) return 0;
          cc = 0;
          co = 0;
          while (1) {
            cc++;
            co = text.indexOf(cxl_list_delimiter, co);
            if (co < 0) return text.length;
            if (cc >= en) return co;
            co += cxl_list_delimiter.length;
          }
          break;

        case "elem":
        case "elems":
        case "element":
        case "elements":
          if (en < 1) return 0;
          cc = 0;
          co = 0;
          while (1) {
            cc++;
            co = text.indexOf(cxl_element_delimiter, co);
            if (co < 0) return text.length;
            if (cc >= en) return co;
            co += cxl_element_delimiter.length;
          }
          break;

        case "line":
        case "lines":
          if (en < 1) return 0;
          cc = 0;
          co = 0;
          while (1) {
            cc++;
            co = text.indexOf("\n", co);
            if (co < 0) return text.length;
            if (cc >= en) return co;
            co++;
          }
          break;

        case "para":
        case "paras":
        case "paragraph":
        case "paragraphs":
          return cxl_paragraph_end(text, en);
          break;

        case "sent":
        case "sents":
        case "sentence":
        case "sentences":
          return cxl_sentence_end(text, en);
          break;

        case "byte":
        case "bytes":
          return en + 1;
          break;

        case "short":
        case "shorts":
          return en * 2 + 2;
          break;

        case "long":
        case "longs":
          return en * 4 + 4;
          break;

        default:
          return 0;
          break;
      }
    },
    // ------------------------------- //
    // Main Chunk Expression Functions //
    // ------------------------------- //

    cxl_count: (text, atomicSelector, atomicTarget, targetPosition) => {
      const tokens = [atomicSelector, atomicTarget, targetPosition];
      var ch = "";
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (ch == "") {
            ch = e;
          } else if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(t, chunk[depth], start[depth]);
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return this.cxl_chunk_count(t, ch);
    },

    cxl_start: (text, tokens) => {
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return s;
    },

    cxl_end: (text, tokens) => {
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return e;
    },

    cxl_get: (
      text,
      atomicSelector,
      selectorStart,
      selectorEnd,
      atomicTarget,
      targetStart,
      targetEnd
    ) => {
      const tokens = [
        atomicSelector,
        selectorStart,
        selectorEnd,
        atomicTarget,
        targetStart,
        targetEnd,
      ];
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return t;
    },

    cxl_delete: (
      text,
      atomicSelector,
      selectorStart,
      selectorEnd,
      atomicTarget,
      targetPosition
    ) => {
      const tokens = [
        atomicSelector,
        selectorStart,
        selectorEnd,
        atomicTarget,
        targetPosition,
      ];
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 1) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      if (depth > 0) {
        depth--;
        // must normalize start and end ourselves; you'll see //
        var cnt = this.cxl_chunk_count(t, chunk[depth]);
        var sta = cxl_astart(chunk[depth], start[depth], cnt);
        var ena = cxl_aend(chunk[depth], sta, end[depth], cnt);
        // somewhat counterintuitive thingamabob coming up //
        var ls = this.cxl_chunk_start(t, chunk[depth], sta, sta);
        var le = this.cxl_chunk_start(t, chunk[depth], ena + 1, ena + 1);
        // you're not seeing things; that's correct //
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return text.substring(0, s) + text.substring(e, text.length);
    },

    cxl_into: (text, tokens, newtext) => {
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return text.substring(0, s) + newtext + text.substring(e, text.length);
    },

    cxl_before: (text, tokens, newtext) => {
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return text.substring(0, s) + newtext + text.substring(s, text.length);
    },

    cxl_after: (text, tokens, newtext) => {
      var field = 0;
      var depth = 0;
      var chunk = new Array(0);
      var start = new Array(0);
      var end = new Array(0);
      var i;
      for (i = 0; i < tokens.length; i++) {
        var e = tokens[i];
        if (!isNaN(e)) {
          field++;
          switch (field) {
            case 1:
              start[depth] = e;
            case 2:
              end[depth] = e;
              break;
          }
        } else if (e.length > 0 && !isNaN(parseInt(e))) {
          field++;
          switch (field) {
            case 1:
              start[depth] = parseInt(e);
            case 2:
              end[depth] = parseInt(e);
              break;
          }
        } else if (e.length > 3) {
          if (field > 0) {
            depth++;
            field = 0;
            chunk[depth] = e;
          } else {
            chunk[depth] = e;
          }
        }
      }
      if (field > 0) depth++;

      var t = text;
      var s = 0;
      var e = t.length;
      while (depth > 0) {
        depth--;
        var ls = this.cxl_chunk_start(
          t,
          chunk[depth],
          start[depth],
          end[depth]
        );
        var le = this.cxl_chunk_end(t, chunk[depth], start[depth], end[depth]);
        t = t.substring(ls, le);
        s = s + ls;
        e = s + t.length;
      }
      return text.substring(0, e) + newtext + text.substring(e, text.length);
    },
  };
};

const docs = {
  cxl_chunk_count: {
    inputs: {
      text: "string",
      atomicSelector:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      start: "number",
      end: "number",
    },
    description: "counts the number of atomic selectors in a string",
    async: false,
  },
  cxl_chunk_start: {
    inputs: {
      text: "string",
      atomicSelector:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      start: "number",
    },
    description:
      "counts the number of atomic selectors in a string from starting point",
    async: false,
  },
  cxl_chunk_end: {
    inputs: {
      text: "string",
      atomicSelector:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      start: "number",
      end: "number",
    },
    description:
      "counts the number of atomic selectors in a string from starting point to ending point",
    async: false,
  },
  cxl_count: {
    inputs: {
      text: "string",
      atomicSelector:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      atomicTarget:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      targetPosition: "number",
    },
    description:
      "finds the number of atomic selectors in an atomic target at position targetPosition of text(e.g. number of CHARS in WORD 2 of ...)",
    async: false,
  },
  cxl_get: {
    inputs: {
      text: "string",
      atomicSelector:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      selectorStart: "number",
      selectorEnd: "number",
      atomicTarget:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      targetStart: "number",
      targetEnd: "number",
    },
    description:
      "gets atomic selector from selector start to selector end at atomic target from start to end(e.g. get CHAR 3 to 4 of WORD 2 to 3 of ...)",
    async: false,
  },
  cxl_delete: {
    inputs: {
      text: "string",
      atomicSelector:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      selectorStart: "number",
      selectorEnd: "number",
      atomicTarget:
        "enum['characters','words','items','lists','elements','lines','paragraph','sentence','byte','short','long']",
      targetPosition: "number",
    },
    description:
      "deletes atomic selector start to end of atomic target at position (e.g. delete CHAR 6 to 8 of WORD 2 of ...)",
    async: false,
  },

  //   // cxl_start(text, tokens) returns the position of the first
  // //     character of the chunk expression, starting from zero.
  // //

  //   downloadOne: {
  //     inputs: {
  //       :"",
  //     },
  //     description: "",
  //     async: false,
  //   },
  //   // cxl_end(text, tokens) returns the position of the last
  // //     character of the chunk expression, starting from zero, plus one.
  // //
  // // (These two are used with JavaScript's substring() method on strings.)
  // //

  //   downloadOne: {
  //     inputs: {
  //       :"",
  //     },
  //     description: "",
  //     async: false,
  //   },
  //   // cxl_into(text, tokens, newtext) inserts newtext
  // //     into (tokens) of text.
  // //
  // // cxl_before(text, tokens, newtext) inserts newtext
  // //     before (tokens) of text.
  // //
  // // cxl_after(text, tokens, newtext) inserts newtext
  // //     after (tokens) of text.
  //   downloadOne: {downloadOne: {
  //     inputs: {
  //       :"",
  //     },
  //     description: "",
  //     async: false,
  //   },
  //     inputs: {
  //       :"",
  //     },
  //     description: "",
  //     async: false,
  //   },
  //TODO:docs incomplete!
};

(() => {
  window.addmodule(init);
  window.adddocs(docs);
})();
