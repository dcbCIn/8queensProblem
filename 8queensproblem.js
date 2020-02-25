
buildBoard('');

var board = new Array(new Array('','','','','','','',''),
                      new Array('','','','','','','',''),
                      new Array('','','','','','','',''),
                      new Array('','','','','','','',''),
                      new Array('','','','','','','',''),
                      new Array('','','','','','','',''),
                      new Array('','','','','','','',''),
                      new Array('','','','','','','',''))

var tests = 0

var solutions = new Array()

findNextValidPosition(board, 0, false);